import mqtt from 'mqtt';

class FamilySyncService {
  constructor() {
    this.client = null;
    this.familyCode = 'SEFYSYS-FAMILY';
    this.username = 'User';
    this.connected = false;
    this.listeners = new Set();
    this.deviceId = 'dev_' + Math.random().toString(36).substring(2, 9);
    
    // Load stored family code if any
    try {
      const savedCode = localStorage.getItem('huhu_family_code');
      if (savedCode) this.familyCode = savedCode;
    } catch (e) {
      // ignore
    }
  }

  getFamilyCode() {
    return this.familyCode;
  }

  setFamilyCode(code) {
    if (!code || code.trim() === '') return;
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    this.familyCode = cleanCode;
    localStorage.setItem('huhu_family_code', cleanCode);
    
    // Reconnect to new family topic
    if (this.client) {
      this.disconnect();
      this.connect(this.username);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    this.listeners.forEach(cb => {
      try {
        cb(event);
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  connect(username) {
    if (username) this.username = username;
    if (this.client && this.connected) return;

    // Use secure public broker over WebSockets (SSL port 8084)
    const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
    const topic = `huhu/family/${this.familyCode}`;

    try {
      this.client = mqtt.connect(brokerUrl, {
        clientId: `huhu_${this.deviceId}_${Date.now()}`,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 5000,
        keepalive: 60,
      });

      this.client.on('connect', () => {
        this.connected = true;
        this.client.subscribe(topic, { qos: 1 }, (err) => {
          if (!err) {
            // Send initial Handshake message across family phones
            this.sendHandshake();
            this.notify({
              type: 'CONNECTION_STATUS',
              connected: true,
              familyCode: this.familyCode,
              message: `Connected to Family Network (${this.familyCode})`
            });
          }
        });
      });

      this.client.on('message', (receivedTopic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          // Ignore own messages based on deviceId to avoid duplicate self-echoes
          if (data.deviceId === this.deviceId) return;
          this.notify(data);
        } catch (e) {
          console.warn('Invalid JSON packet received:', e);
        }
      });

      this.client.on('offline', () => {
        this.connected = false;
        this.notify({ type: 'CONNECTION_STATUS', connected: false, message: 'Offline / Reconnecting...' });
      });

      this.client.on('error', (err) => {
        console.warn('MQTT Connection error:', err);
        this.connected = false;
        this.notify({ type: 'CONNECTION_STATUS', connected: false, message: 'Connection Error' });
      });
    } catch (err) {
      console.warn('MQTT connect failed:', err);
      this.connected = false;
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch (e) {
        // ignore
      }
      this.client = null;
      this.connected = false;
    }
  }

  sendHandshake() {
    this.publish({
      type: 'HANDSHAKE',
      sender: this.username,
      text: `${this.username} connected phone via internet handshake`,
      timestamp: Date.now()
    });
  }

  broadcastAddItem(item) {
    this.publish({
      type: 'ADD_ITEM',
      sender: this.username,
      item: item,
      timestamp: Date.now()
    });
  }

  broadcastToggleItem(itemId, completed, itemTitle) {
    this.publish({
      type: 'TOGGLE_ITEM',
      sender: this.username,
      itemId: itemId,
      completed: completed,
      itemTitle: itemTitle,
      timestamp: Date.now()
    });
  }

  publish(data) {
    if (!this.client || !this.connected) return;
    const packet = {
      ...data,
      deviceId: this.deviceId,
      familyCode: this.familyCode
    };
    const topic = `huhu/family/${this.familyCode}`;
    this.client.publish(topic, JSON.stringify(packet), { qos: 1 });
  }
}

export const familySyncService = new FamilySyncService();
