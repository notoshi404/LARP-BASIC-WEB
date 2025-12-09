# LARP - BASIC Simulator

โปรแกรมจำลองการทำงานของอัลกอริทึมแฮชของ Bitcoin ที่ถูกทำให้เรียบง่ายลง เรียกว่า "LARP - BASIC" แอปพลิเคชันนี้ช่วยให้ผู้ใช้สามารถตรวจสอบ nonce และจำลองกระบวนการขุด (mining) เพื่อค้นหา block hash ที่ถูกต้อง ใช้สำหรับในการเล่น LARP - Live Action Role Play

## Credits

โปรเจกต์นี้ดัดแปลงมาจาก [BASIC - Bitcoin Algorithm Simulator In C](https://github.com/niftynei/BASIC) โดย [@niftynei](https://github.com/niftynei)

การดัดแปลง:
- แปลงจาก C เป็น TypeScript/JavaScript
- สร้าง Web Interface สำหรับใช้งานผ่าน Browser
- เพิ่มการแสดงผลแบบ Real-time
- ปรับให้เหมาะสำหรับการเล่น LARP (Live Action Role Play)


## คุณสมบัติ

- **การตรวจสอบ Nonce**: ตรวจสอบว่า nonce ที่กำหนดสร้าง block hash ที่ถูกต้องหรือไม่
- **ตัวจำลองการขุด**: จำลองการขุดแบบเรียลไทม์เพื่อค้นหา nonce ที่ถูกต้อง
- **สถิติแบบสด**: ติดตามจำนวนครั้งที่พยายาม, hash ที่ต่ำที่สุด และประสิทธิภาพ
- **การตรวจสอบตาม Target**: กำหนดระดับความยากของ target ได้

## เริ่มต้นใช้งาน

### วิธีที่ 1: Docker Compose (แนะนำ)

```bash
# Clone repository
git clone <your-repository-url>
cd LARP-BASIC-WEB

# เริ่มต้นด้วย Docker Compose
docker-compose up -d

# เข้าใช้งานแอปพลิเคชัน
# Production: http://localhost:8080
```

### วิธีที่ 2: Docker

```bash
# Build image
docker build -t larp-basic-web .

# Run container
docker run -d -p 8080:80 --name larp-web larp-basic-web

# เข้าใช้งานที่ http://localhost:8080
```

### วิธีที่ 3: การพัฒนาแบบ Local

```bash
# ติดตั้ง dependencies
npm install

# เริ่ม development server
npm run dev

# เข้าใช้งานที่ http://localhost:5173
```

## วิธีการใช้งาน

### 1. ตรวจสอบ Nonce

1. กรอกค่าต่างๆ ดังนี้:
   - **Prev Block**: Hash ของ block ก่อนหน้า
   - **Tx Commit**: Hash ของ transaction commitment
   - **Time**: เวลาของ block
   - **Target**: ค่า target ความยาก
   - **Nonce**: ค่า nonce ที่ต้องการตรวจสอบ

2. คลิกปุ่ม **"Verify Nonce"**

3. ดูผลลัพธ์ในแผง Output:
   - **SUCCESS**: Hash ≤ Target
   - **FAILURE**: Hash > Target

### 2. เริ่มการขุด

1. กรอกพารามิเตอร์ของ block (Prev Block, Tx Commit, Time, Target)
2. คลิกปุ่ม **"Start Mining"**
3. ติดตามการอัพเดทแบบเรียลไทม์:
   - จำนวนครั้งที่พยายาม
   - Hash ที่ต่ำที่สุดที่พบ
   - Nonce ปัจจุบันที่กำลังทดสอบ
4. การขุดจะหยุดอัตโนมัติเมื่อพบ nonce ที่ถูกต้อง
5. คลิกปุ่ม **"Stop Mining"** เพื่อหยุดได้ตลอดเวลา

## อัลกอริทึม

อัลกอริทึม LARP - BASIC จำลอง Proof-of-Work ของ Bitcoin:

1. เชื่อมต่อ: `prevBlock + txCommit + time + nonce`
2. Hash ด้วย SHA-256
3. เปรียบเทียบผลลัพธ์กับ target
4. ถูกต้องถ้า: `hash ≤ target`
