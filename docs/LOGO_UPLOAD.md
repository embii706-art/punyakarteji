# Logo Upload Instructions

## 📸 Cara Upload Logo

### **Quick Steps:**

1. **Siapkan file logo Anda** dengan nama `logo.jpeg` atau `logo.jpg`
2. **Upload ke folder `public/`**:
   ```
   /workspaces/punyakarteji/public/logo.jpeg
   ```

### **Spesifikasi Logo:**

| Property | Recommended |
|----------|-------------|
| **Format** | JPEG, JPG, PNG, atau SVG |
| **Size** | 512x512 px (square) |
| **Max File Size** | < 500 KB |
| **Background** | Transparent (PNG) atau solid color |

### **Upload Methods:**

#### **Method 1: Via VS Code Explorer**
1. Buka folder `public/` di VS Code
2. Drag & drop file `logo.jpeg` ke folder tersebut
3. Atau klik kanan → Upload → pilih file

#### **Method 2: Via Terminal**
```bash
# Jika logo ada di folder Downloads
cp ~/Downloads/logo.jpeg /workspaces/punyakarteji/public/

# Atau dari folder lain
cp /path/to/your/logo.jpeg /workspaces/punyakarteji/public/
```

#### **Method 3: Via Git**
```bash
# Add logo file
git add public/logo.jpeg

# Commit
git commit -m "feat: add company logo"

# Push
git push origin main
```

---

## 🎨 Logo Will Appear In:

✅ **Browser Tab** (favicon)  
✅ **PWA App Icon** (when installed)  
✅ **App Header** (top navigation bar)  
✅ **Apple Touch Icon** (iOS devices)  
✅ **Android Splash Screen**

---

## 🔄 After Upload:

1. **Refresh browser** (Ctrl+Shift+R / Cmd+Shift+R)
2. Logo akan muncul otomatis di semua tempat
3. Jika tidak muncul, clear cache dan reload

---

## 📝 Files Updated:

- ✅ `index.html` - favicon & apple-touch-icon
- ✅ `public/manifest.json` - PWA icons
- ✅ `src/layout.js` - header logo dengan fallback

---

## 🐛 Troubleshooting:

**Logo tidak muncul?**
- Pastikan nama file **persis** `logo.jpeg` (lowercase)
- Cek ukuran file < 500 KB
- Hard refresh browser (Ctrl+Shift+R)
- Cek folder `public/` ada file nya

**Logo terpotong/blur?**
- Gunakan ukuran 512x512 px (square)
- Format PNG dengan background transparent lebih baik
- Compress jika file > 500 KB

---

## 🎯 Alternative Logo Formats:

Jika file Anda bukan JPEG, rename references:

**For PNG:**
```bash
# Rename file
mv public/logo.jpeg public/logo.png

# Update references in:
# - index.html (type="image/png")
# - manifest.json (type: "image/png")
```

**For SVG:**
```bash
# Rename file
mv public/logo.jpeg public/logo.svg

# Update references in:
# - index.html (type="image/svg+xml")
# - manifest.json (type: "image/svg+xml")
```

---

**Ready to upload?** Just drop `logo.jpeg` into `public/` folder! 🚀
