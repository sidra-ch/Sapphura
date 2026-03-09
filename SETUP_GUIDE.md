# 🚀 Quick Setup Guide - Sappura React Project

## Step-by-Step Installation Instructions

### Step 1: Open PowerShell/Terminal
Right-click on the project folder and select "Open in Terminal" or navigate using:
```powershell
cd "c:\My Web Sites\Sappura\Sappura-react"
```

### Step 2: Install Dependencies
Run the following command to install all required packages:
```powershell
npm install
```

**Note:** First installation may take 2-3 minutes depending on your internet speed.

### Step 3: Start Development Server
After installation completes, start the development server:
```powershell
npm run dev
```

### Step 4: Open in Browser
Once the server starts, you'll see:
```
 ▲ Next.js 14.2.3
 - Local:        http://localhost:3000
 - Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

Open your browser and navigate to: **http://localhost:3000**

---

## 📋 Troubleshooting

### Issue: "npm is not recognized"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Port 3000 is already in use
**Solution:** 
1. Stop any other application using port 3000, OR
2. Run on different port:
   ```powershell
   npm run dev -- -p 3001
   ```

### Issue: Dependencies installation fails
**Solution:**
1. Delete `node_modules` folder (if exists)
2. Delete `package-lock.json` (if exists)
3. Run `npm install` again

---

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload enabled) |
| `npm run build` | Build for production |
| `npm start` | Start production server (after build) |
| `npm run lint` | Check code quality |

---

## 🌐 Project URLs

After starting the dev server:

- **Homepage:** http://localhost:3000
- **All Collections:** http://localhost:3000/collections
- **Shopping Cart:** http://localhost:3000/cart

---

## 📁 Project Structure Quick Reference

```
Sappura-react/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Main layout
│   │   ├── collections/       # Collections page
│   │   └── cart/              # Cart page
│   ├── components/            # Reusable components
│   │   ├── layout/           # Header, Footer
│   │   └── home/             # Homepage sections
│   └── store/                # State management
│       └── cartStore.ts      # Shopping cart state
├── public/                   # Static files
├── package.json             # Dependencies
└── README.md               # Documentation
```

---

## ✅ Verification Steps

After running `npm run dev`, verify:

1. ✓ Server starts without errors
2. ✓ Homepage loads at http://localhost:3000
3. ✓ Navigation menu is visible
4. ✓ Animations work smoothly
5. ✓ Can navigate to Collections page
6. ✓ Shopping cart opens

---

## 🎨 Next Steps

1. **Customize Content:** Edit components in `src/components/`
2. **Add Products:** Update product data in components
3. **Modify Styles:** Edit `tailwind.config.ts` for colors
4. **Add Pages:** Create new folders in `src/app/`

---

## 📞 Need Help?

If you encounter any issues:

1. Check the error message in terminal
2. Review the console in browser (F12)
3. Refer to README.md for detailed documentation
4. Clear browser cache and restart server

---

## 🔥 Quick Tips

- **Hot Reload:** Code changes automatically refresh the browser
- **Save Cart:** Cart data persists in browser localStorage
- **Responsive:** Test on mobile using browser DevTools (F12)
- **Performance:** Use `npm run build` before deploying

---

**Happy Coding! 🚀**

Built with Next.js 14, TypeScript, and Tailwind CSS
