# Professor Atef Allam - Academic Portfolio Website

A modern, professional academic portfolio website built with HTML, CSS, and JavaScript. Designed for GitHub Pages deployment with a focus on academic presentation, research showcase, and professional networking.

## 🚀 Features

### Design & User Experience
- **Modern Academic Aesthetic**: Clean, professional design with academic color scheme
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Dark/Light Theme**: Toggle between light and dark modes with localStorage persistence
- **Smooth Animations**: Intersection Observer-based animations and smooth transitions
- **Professional Typography**: Modern font choices with optimal readability

### Academic Content Sections
1. **Home/About**: Professional introduction and academic background
2. **Expertise**: Research areas, methodologies, and current projects
3. **Publications**: Searchable/filterable publication list with citations
4. **Lectures**: Course offerings, keynotes, workshops, and teaching philosophy
5. **Books**: Authored works, edited volumes, and upcoming publications
6. **Reflections**: Personal insights and academic thoughts
7. **Career**: Professional timeline, education, awards, and service
8. **Contact**: Contact information, office hours, and inquiry form

### Technical Features
- **Static Site**: Pure HTML/CSS/JS - no build process required
- **GitHub Pages Ready**: Direct deployment capability
- **SEO Optimized**: Comprehensive meta tags, Open Graph, and structured data
- **Accessibility**: WCAG 2.1 Level AA compliance with keyboard navigation
- **Performance**: Optimized images, minimal JavaScript, fast loading
- **Citation Generator**: Academic citation formats with copy-to-clipboard
- **Search & Filter**: Dynamic content filtering and search functionality

## 📁 Project Structure

```
/
├── index.html              # Homepage/About
├── expertise.html          # Research expertise
├── publications.html       # Academic publications
├── lectures.html          # Teaching & lectures
├── books.html             # Authored books
├── reflections.html       # Academic reflections
├── career.html           # Career timeline
├── contact.html          # Contact information
├── assets/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   └── main.js       # Interactive functionality
│   ├── images/           # Images and photos
│   └── files/            # PDFs, CVs, documents
├── lectures/             # Lecture subdirectories
├── README.md
└── .gitignore
```

## 🛠️ Setup Instructions

### 1. Content Customization

Replace all placeholder content marked with `[PLACEHOLDER - ...]` with actual information:

**Personal Information:**
- Name, title, and current position
- Email, phone, office address
- Professional photo and biography
- Academic credentials and timeline

**Academic Content:**
- Research areas and expertise
- Publication list with DOIs
- Course information and syllabi
- Book details and ISBNs
- Awards and recognition

**Professional Links:**
- LinkedIn, ResearchGate, Google Scholar
- ORCID ID and other academic profiles
- University/institution websites

### 2. File Organization

**Images** (`assets/images/`):
- `profile.jpg` - Professional headshot
- `favicon.ico` - Website favicon
- Research diagrams and photos

**Documents** (`assets/files/`):
- `cv-atef-allam.pdf` - Complete CV
- Publication PDFs
- Course syllabi
- Book samples/chapters

### 3. GitHub Pages Deployment

1. **Create Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial academic portfolio"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages section
   - Set Source to "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click Save

3. **Custom Domain (Optional):**
   - Add `CNAME` file with your domain
   - Configure DNS settings
   - Enable "Enforce HTTPS" in settings

### 4. Configuration Options

**Theme Colors** (in `assets/css/style.css`):
```css
:root {
  --academic-blue: oklch(0.3 0.15 230);
  --academic-success: oklch(0.6 0.15 140);
  /* Customize as needed */
}
```

**Navigation Menu** (update in all HTML files):
```html
<ul class="nav-links">
  <li><a href="index.html">About</a></li>
  <!-- Add/remove sections as needed -->
</ul>
```

**Contact Form** (requires external service):
- Integrate with Netlify Forms, Formspree, or similar
- Update form action in `contact.html`

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## ♿ Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatibility
- Focus indicators
- Alternative text for images

## 🔧 Customization Guide

### Adding New Publications

1. Update `publications.html` with new entries
2. Follow existing format for consistency
3. Include DOI links and PDF downloads
4. Update publication counts in statistics

### Modifying Sections

1. Update navigation in all HTML files
2. Modify CSS classes as needed
3. Ensure mobile responsiveness
4. Test across different devices

### Theme Customization

1. Modify CSS variables in `:root`
2. Update color scheme consistently
3. Test both light and dark modes
4. Ensure accessibility compliance

## 📈 Performance Optimization

- **Images**: Use WebP format with fallbacks
- **Fonts**: Preload critical fonts
- **CSS**: Minify for production
- **JavaScript**: Keep minimal and efficient
- **Caching**: Leverage browser caching

## 🚦 Testing Checklist

Before deployment, verify:

- [ ] All placeholder content replaced
- [ ] Navigation works across all pages
- [ ] Responsive design on mobile/tablet
- [ ] Dark/light theme toggle functions
- [ ] Contact form submissions work
- [ ] All external links open correctly
- [ ] Images load with proper alt text
- [ ] PDFs and documents are accessible

## 📄 License

This academic portfolio template is provided as-is. You're free to use and modify it for your academic website. Please ensure any external resources (fonts, icons) comply with their respective licenses.

## 🤝 Support

For questions about this template or academic website best practices:
- Review the code comments for guidance
- Check browser developer tools for debugging
- Validate HTML/CSS for standards compliance
- Test accessibility with screen readers

---

**Built with ❤️ for academic excellence**

*Last updated: January 2025*
