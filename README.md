
# ROTA Hyperloop





## Startup

Arayüz'ü başlatmak için:

```bash
  npm start
```
Raspberry Pi sunucu:

```bash
  python3 src/tcpServer.py:
```

## JSON message format

Sensör verileri

```code
  {
        message_type: sensor_data
        data_name: velocity_x,
        value: 30

    }
```

**data_name listesi:**

position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, acceleration_x, acceleration_y, acceleration_z, pressure, motor_battery, accesory_battery, roll, pitch, yaw.

**Komutlar listesi:**

start_levitation,
stop_levitation,
start_motor,
stop_motor,
emergency_stop,
connect_sensors




