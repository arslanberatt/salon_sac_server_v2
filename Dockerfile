# 1. Base image
FROM node:18

# 2. Çalışma dizini oluştur
WORKDIR /app

# 3. Bağımlılık dosyalarını kopyala
COPY package*.json ./

# 4. Sadece gerekli paketleri yükle (daha hızlı ve temiz)
RUN npm ci --omit=dev

# 5. Tüm dosyaları kopyala
COPY . .

# 6. Ortam ve port tanımla
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# 7. Uygulamayı başlat
CMD ["npm", "start"]
