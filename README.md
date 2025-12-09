# 🟠 CBDC vs Bitcoin - The Choice Between Control and Freedom

**A multilingual educational website exposing the threats of Central Bank Digital Currencies (CBDCs) and presenting Bitcoin as the decentralized alternative.**

🌐 **Live Site**: [cbdc.icu](https://cbdc.icu)

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-₿-F7931A?logo=bitcoin)](https://bitcoin.org)

---

## 🎯 Mission

This project aims to **educate people about the dangers of CBDCs** - programmable money that enables:
- 🔴 **Total financial surveillance** - every transaction tracked
- 🔴 **Account freezing** - political control over your money  
- 🔴 **Programmable restrictions** - expiring money, spending limits
- 🔴 **Cash elimination** - no escape from digital control

We present **Bitcoin as the solution** - a decentralized, censorship-resistant alternative that gives people true financial sovereignty.

---

## 🚀 Why This Matters

Central banks worldwide (including the ECB) are preparing to launch CBDCs by 2028-2030. **Most people don't understand what they're about to lose.**

This website:
- ✅ Explains CBDC threats in simple terms
- ✅ Compares CBDC vs Bitcoin side-by-side
- ✅ Provides actionable steps to protect financial freedom
- ✅ Available in **4 languages** (Slovak, English, Spanish, German)
- ✅ Optimized for **social media sharing** to spread awareness

**We need YOUR help to reach more people before it's too late.**

---

## 🌍 Features

- 🌐 **4 Languages**: Slovak, English, Spanish, German
- 📱 **Fully Responsive** - works on all devices
- ⚡ **Fast & Optimized** - built with Vue 3 + Vite
- 🎨 **Modern Design** - engaging visual experience
- 📊 **Timeline** - showing what's coming (2023-2030+)
- 📰 **Live News Feed** - latest CBDC updates (Local & Global)
- 🎥 **Video Integration** - educational content
- 🔗 **Social Sharing** - Facebook, X, Instagram, Nostr, Telegram, WhatsApp
- 🎯 **SEO Optimized** - proper meta tags for all platforms
- ♿ **Accessible** - WCAG compliant

---

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing for multilingual support
- **Vue i18n** - Internationalization
- **@vueuse/head** - Dynamic meta tags for SEO
- **Vite** - Next-generation frontend tooling

---

## 📦 Installation & Development
```bash
# Clone the repository
git clone https://github.com/webiumsk/cbdc-bitcoin.git
cd cbdc-bitcoin

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Project Structure
```
cbdc-bitcoin/
├── src/
│   ├── components/       # Vue components
│   │   ├── HeroSection.vue
│   │   ├── Timeline.vue
│   │   ├── Comparison.vue
│   │   ├── Threats.vue
│   │   ├── NewsFeed.vue
│   │   ├── Solution.vue
│   │   ├── ActionPlan.vue
│   │   ├── VideoSection.vue
│   │   ├── CTA.vue
│   │   ├── SocialShare.vue
│   │   ├── LanguageSwitcher.vue
│   │   └── BackToTop.vue
│   ├── views/            # Page views
│   │   └── Home.vue
│   ├── locales/          # Translation files
│   │   ├── sk.json       # Slovak
│   │   ├── en.json       # English
│   │   ├── es.json       # Spanish
│   │   └── de.json       # German
│   ├── router/           # Vue Router config
│   ├── App.vue           # Root component
│   ├── main.js           # Entry point
│   ├── i18n.js           # i18n configuration
│   └── style.css         # Global styles
├── public/               # Static assets
│   └── favicon icons
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🌍 Adding New Languages

Want to help translate into another language? It's easy!

1. Create a new file: `src/locales/[lang].json`
2. Copy content from `en.json` and translate
3. Add to `src/i18n.js`:
```javascript
import newLang from './locales/newlang.json'
// ... add to messages object
```
4. Add route in `src/router/index.js`
5. Add language switcher button in `LanguageSwitcher.vue`
6. Submit a Pull Request!

---

## 🤝 Contributing

**Contributions are highly encouraged!** This is a community project to spread awareness.

### How you can help:

#### 1. **Spread the Word** 🔊
- Share the website on social media
- Talk to friends and family about CBDC dangers
- Write articles or make videos about the project

#### 2. **Improve Content** ✍️
- Suggest better explanations
- Add more educational resources
- Improve translations
- Report inaccuracies

#### 3. **Code Contributions** 💻
- Fix bugs
- Add new features
- Improve performance
- Enhance accessibility

#### 4. **Design** 🎨
- Create better graphics
- Improve UI/UX
- Design social media templates
- Create promotional materials

### Contribution Process:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

We review PRs quickly and appreciate all contributions, big or small!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can freely use, modify, and distribute this project. We encourage forks and derivatives!

---

## 🎯 Roadmap

- [x] 4 languages (SK, EN, ES, DE)
- [x] Social sharing buttons
- [x] Video integration
- [ ] Blog section with articles
- [x] Interactive CBDC map/timeline (Dynamic Data)
- [x] Live CBDC News Feed
- [ ] Downloadable infographics
- [ ] Email newsletter signup
- [ ] More language versions (FR, IT, PT, PL...)
- [ ] Dark/Light theme toggle
- [x] Bitcoin payment integration for donations

---

## 💡 Why Open Source?

**Freedom requires transparency.** 

We're fighting against centralized control, so this project must be:
- ✅ **Open** - anyone can inspect the code
- ✅ **Decentralized** - forks encouraged
- ✅ **Collaborative** - community-driven
- ✅ **Free** - no paywalls, no tracking

---

## 📞 Contact & Community

- **Website**: [cbdc.icu](https://cbdc.icu)
- **Issues**: [GitHub Issues](https://github.com/webiumsk/cbdc-bitcoin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/webiumsk/cbdc-bitcoin/discussions)
- **Twitter/X**: [@webiumsk](https://twitter.com/webiumsk)
- **Nostr**: `npub1sdfk8sxrk53lxqhkl3u6dv6fkjsgxzwg964f96sf3ap4xytdjzdqs3s9x9`

---

## 🙏 Acknowledgments

- **Bitcoin Community** - for building the freedom alternative
- **Dvadsatjeden.org** - Slovak Bitcoin education
- All **contributors** who help spread this message
- **You** - for caring about financial freedom

---

## ⚠️ Disclaimer

This website provides educational information about CBDCs and Bitcoin. It is not financial advice. 

**Do your own research. Verify everything. Trust no one blindly - not even us.**

That's the Bitcoin way. 🟠

---

## 🔥 Urgent Call to Action

**The ECB is planning to launch the digital euro by 2028-2030.**

**If we don't act now, our children will grow up in a world where:**
- Every purchase is tracked
- Money can expire
- Accounts can be frozen for any reason
- Cash no longer exists
- Financial privacy is a distant memory

**We have a small window to spread awareness and build alternatives.**

**Fork this repo. Share the website. Talk to people. Act now.**

The clock is ticking. ⏰

---

<div align="center">

**Made with 🧡 for ₿**

**Freedom isn't free. Fight for it.**

[🌐 Visit Website](https://cbdc.icu) • [⭐ Star on GitHub](https://github.com/webiumsk/cbdc-bitcoin) • [🔄 Share](https://cbdc.icu)

</div>