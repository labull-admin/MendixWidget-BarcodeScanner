# GitHub Repository Setup Guide

This guide will help you set up the Mendix Barcode Scanner Widget repository on GitHub.

## Prerequisites

- GitHub account
- Git installed on your system
- The project files already committed locally

## Steps to Create GitHub Repository

### 1. Create Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `MendixWidget-BarcodeScanner`
   - **Description**: `A powerful barcode scanning widget for Mendix applications using Dynamsoft SDK`
   - **Visibility**: Choose Public or Private
   - **Initialize**: Do NOT check any initialization options (we already have files)

### 2. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands to connect your local repository. Run these commands in your terminal:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/MendixWidget-BarcodeScanner.git

# Push your local commits to GitHub
git push -u origin master
```

### 3. Repository Settings (Optional)

#### Add Repository Topics
Go to your repository → Settings → General → Topics and add:
- `mendix`
- `widget`
- `barcode-scanner`
- `dynamsoft`
- `javascript`
- `typescript`
- `react`

#### Add Repository Description
Update the repository description to:
```
A powerful and flexible barcode scanning widget for Mendix applications that supports both camera scanning and image upload functionality using Dynamsoft Barcode Reader SDK. Maintained by 兰博基尼织造.
```

#### Enable Issues and Wiki
- Go to Settings → Features
- Enable Issues for bug reports and feature requests
- Enable Wiki for additional documentation

### 4. Create Release

1. Go to the "Releases" section
2. Click "Create a new release"
3. Fill in the details:
   - **Tag version**: `v1.0.0`
   - **Release title**: `Mendix Barcode Scanner Widget v1.0.0`
   - **Description**: Copy from the README.md features section
   - **Attach files**: Upload the `.mpk` file from the `dist/` folder

### 5. Repository Structure

Your repository should have this structure:
```
MendixWidget-BarcodeScanner/
├── .gitignore
├── .gitattributes
├── LICENSE
├── README.md
├── EXAMPLES.md
├── package.json
├── tsconfig.json
├── src/
│   ├── BarcodeScanner.tsx
│   ├── BarcodeScanner.xml
│   ├── BarcodeScanner.editorConfig.ts
│   ├── ui/
│   │   └── BarcodeScanner.css
│   └── utils/
│       ├── language.ts
│       └── sdk.ts
├── dist/
│   └── 1.0.0/
│       └── labull.BarcodeScanner.mpk
└── typings/
    └── BarcodeScannerProps.d.ts
```

### 6. GitHub Actions (Optional)

Create `.github/workflows/build.yml` for automated builds:

```yaml
name: Build Widget

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build widget
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v2
      with:
        name: widget-build
        path: dist/
```

### 7. Contributing Guidelines

Create `CONTRIBUTING.md`:

```markdown
# Contributing to Mendix Barcode Scanner Widget

Thank you for your interest in contributing to this project!

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Code Style

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

## Reporting Issues

When reporting issues, please include:
- Mendix version
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
```

### 8. Final Steps

1. **Update README.md** with the correct GitHub repository URL
2. **Create Issues** for known bugs or planned features
3. **Add Collaborators** if working with a team
4. **Set up Branch Protection** rules for the master branch

## Repository URL

Once set up, your repository will be available at:
`https://github.com/YOUR_USERNAME/MendixWidget-BarcodeScanner`

## Support

For questions about setting up the repository, please contact 兰博基尼织造.

---

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username throughout this guide.
