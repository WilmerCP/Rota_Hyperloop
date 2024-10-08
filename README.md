
# ROTA Hyperloop

Teknofest yarışması için hyperloop treninin çalıştırılmasını sağlayan masaüstü uygulaması

<img src="https://github.com/WilmerCP/Rota_Hyperloop/blob/8652a28168ea23a0773a2abe2d9306ae9f81a6b8/interface.png" width="480" height="360">

## Kurulum

Node modules dosyasını oluşturun

```bash
  npm install
```
Python pyserial kütüphanesini indirin

```bash
  pip3 install pyserial
```

## Startup

Arayüz'ü başlatmak için:

```bash
  npm start
```
Raspberry Pi sunucu:

```bash
  python3 src/tcpServer.py
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
connect_sensors,
brake_start,
brake_stop
