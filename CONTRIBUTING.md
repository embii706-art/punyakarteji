# Contributing to KARTEJI

Thank you for your interest in contributing to KARTEJI! 🎉

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/punyakarteji.git
   cd punyakarteji
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Workflow

### 1. Make Your Changes

- Follow existing code style
- Use ES Modules (import/export)
- Add `.js` extension to all imports
- Use Tailwind CSS for styling
- Keep mobile-first approach

### 2. Test Your Changes

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Test all features thoroughly
```

### 3. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add new feature X"
```

**Commit message format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Go to original repository
- Click "New Pull Request"
- Select your branch
- Describe your changes clearly
- Link related issues

## 🎯 What to Contribute

### High Priority
- Complete Bank Sampah module
- Complete Finance module
- Complete UMKM module
- Add unit tests
- Improve documentation

### Medium Priority
- Add more chart types
- Enhance offline support
- Add data export features
- Improve mobile UI/UX

### Low Priority
- Add animations
- Improve loading states
- Add more themes
- Internationalization (i18n)

## 📝 Code Style

### JavaScript
- Use ES6+ features
- Use `const` and `let`, never `var`
- Use arrow functions when appropriate
- Use template literals for strings
- Add JSDoc comments for functions

```javascript
/**
 * Create a new member
 * @param {Object} memberData - Member information
 * @returns {Promise<string>} Document ID
 */
export async function createMember(memberData) {
  // Implementation
}
```

### HTML/CSS
- Use semantic HTML
- Use Tailwind utility classes
- Follow mobile-first approach
- Keep accessibility in mind (ARIA labels)

### File Naming
- Use kebab-case: `auth-service.js`
- Use PascalCase for components: `DashboardPage`
- Group related files in folders

## 🔒 Security

### DO NOT commit:
- API keys or secrets
- Firebase private keys
- User credentials
- Personal information

### DO:
- Use environment variables
- Follow Firebase security rules
- Validate user input
- Sanitize data before display

## 🧪 Testing

Before submitting PR:

- [ ] Code runs without errors
- [ ] All features work as expected
- [ ] Mobile responsive design
- [ ] Dark/Light theme works
- [ ] No console errors
- [ ] Firestore rules enforced

## 📚 Documentation

When adding features:

1. Update README.md if needed
2. Add inline comments for complex logic
3. Update relevant docs/ files
4. Include usage examples

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: What happened?
2. **Expected**: What should happen?
3. **Steps**: How to reproduce?
4. **Environment**: Browser, OS, device
5. **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features:

1. **Use Case**: Why is this needed?
2. **Description**: What should it do?
3. **Examples**: Similar implementations?
4. **Priority**: How important?

## 🤝 Code Review Process

All PRs will be reviewed for:

- Code quality and style
- Functionality and testing
- Documentation
- Security implications
- Performance impact

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/embii706-art/punyakarteji/issues)
- **Discussions**: [GitHub Discussions](https://github.com/embii706-art/punyakarteji/discussions)
- **Email**: Contact repository owner

## 🎓 Resources

- [Vite Documentation](https://vitejs.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## ✅ Checklist Before Submitting PR

- [ ] Code follows project style guide
- [ ] Changes have been tested locally
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Commit messages are clear
- [ ] PR description is detailed
- [ ] Related issues are linked

## 🙏 Thank You!

Your contributions make KARTEJI better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue or discussion. We're here to help! 😊
