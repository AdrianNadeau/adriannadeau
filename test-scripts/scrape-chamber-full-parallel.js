// Web Scraper for thechambersj.com
// This code provides both browser-based and Node.js approaches

// ====================================
// BROWSER-BASED SCRAPING (Client-side)
// ====================================

class BrowserScraper {
    constructor(baseUrl = 'https://thechambersj.com') {
        this.baseUrl = baseUrl;
        this.delay = 1000; // 1 second delay between requests
    }

    // Add delay to be respectful to the server
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fetch page content with error handling
    async fetchPage(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }

    // Parse HTML content (works in browser environment)
    parseHTML(htmlString) {
        const parser = new DOMParser();
        return parser.parseFromString(htmlString, 'text/html');
    }

    // Extract specific data from the page
    extractData(doc) {
        const data = {
            title: '',
            headings: [],
            links: [],
            paragraphs: [],
            images: [],
            metadata: {}
        };

        // Extract title
        const titleElement = doc.querySelector('title');
        data.title = titleElement ? titleElement.textContent.trim() : '';

        // Extract headings
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
        data.headings = Array.from(headings).map(h => ({
            tag: h.tagName.toLowerCase(),
            text: h.textContent.trim()
        }));

        // Extract links
        const links = doc.querySelectorAll('a[href]');
        data.links = Array.from(links).map(link => ({
            text: link.textContent.trim(),
            href: link.href,
            target: link.target || '_self'
        }));

        // Extract paragraphs
        const paragraphs = doc.querySelectorAll('p');
        data.paragraphs = Array.from(paragraphs)
            .map(p => p.textContent.trim())
            .filter(text => text.length > 0);

        // Extract images
        const images = doc.querySelectorAll('img');
        data.images = Array.from(images).map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || ''
        }));

        // Extract meta tags
        const metaTags = doc.querySelectorAll('meta');
        Array.from(metaTags).forEach(meta => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            const content = meta.getAttribute('content');
            if (name && content) {
                data.metadata[name] = content;
            }
        });

        return data;
    }

    // Main scraping function
    async scrape(path = '/') {
        const url = `${this.baseUrl}${path}`;
        console.log(`Scraping: ${url}`);

        const htmlContent = await this.fetchPage(url);
        if (!htmlContent) return null;

        await this.sleep(this.delay);

        const doc = this.parseHTML(htmlContent);
        return this.extractData(doc);
    }

    // Scrape multiple pages
    async scrapeMultiple(paths) {
        const results = [];
        
        for (const path of paths) {
            const result = await this.scrape(path);
            if (result) {
                results.push({ path, data: result });
            }
        }
        
        return results;
    }
}

// ====================================
// NODE.JS SCRAPING (Server-side)
// ====================================

// Note: This requires installing dependencies:
// npm install axios cheerio

/*
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

class NodeScraper {
    constructor(baseUrl = 'https://thechambersj.com') {
        this.baseUrl = baseUrl;
        this.delay = 1000;
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        };
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchPage(url) {
        try {
            const response = await axios.get(url, {
                headers: this.headers,
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error.message);
            return null;
        }
    }

    extractData(html) {
        const $ = cheerio.load(html);
        
        const data = {
            title: $('title').text().trim(),
            headings: [],
            links: [],
            paragraphs: [],
            images: [],
            metadata: {}
        };

        // Extract headings
        $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
            data.headings.push({
                tag: elem.tagName.toLowerCase(),
                text: $(elem).text().trim()
            });
        });

        // Extract links
        $('a[href]').each((i, elem) => {
            data.links.push({
                text: $(elem).text().trim(),
                href: $(elem).attr('href'),
                target: $(elem).attr('target') || '_self'
            });
        });

        // Extract paragraphs
        $('p').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text.length > 0) {
                data.paragraphs.push(text);
            }
        });

        // Extract images
        $('img').each((i, elem) => {
            data.images.push({
                src: $(elem).attr('src'),
                alt: $(elem).attr('alt') || '',
                title: $(elem).attr('title') || ''
            });
        });

        // Extract meta tags
        $('meta').each((i, elem) => {
            const name = $(elem).attr('name') || $(elem).attr('property');
            const content = $(elem).attr('content');
            if (name && content) {
                data.metadata[name] = content;
            }
        });

        return data;
    }

    async scrape(path = '/') {
        const url = `${this.baseUrl}${path}`;
        console.log(`Scraping: ${url}`);

        const htmlContent = await this.fetchPage(url);
        if (!htmlContent) return null;

        await this.sleep(this.delay);
        return this.extractData(htmlContent);
    }

    
    async saveToFile(data, filename) {
        try {
            await fs.writeFile(filename, JSON.stringify(data, null, 2));
            console.log(`Data saved to ${filename}`);
        } catch (error) {
            console.error(`Error saving file:`, error);
        }
    }
}

// ====================================
// USAGE EXAMPLES
// ====================================

// Browser usage example
async function browserExample() {
    const scraper = new BrowserScraper();
    
    try {
        // Scrape the homepage
        const homeData = await scraper.scrape('/');
        console.log('Homepage data:', homeData);
        
        // Scrape multiple pages
        const pages = ['/', '/about', '/contact', '/services'];
        const allData = await scraper.scrapeMultiple(pages);
        console.log('All scraped data:', allData);
        
    } catch (error) {
        console.error('Scraping error:', error);
    }
}

// Node.js usage example
/*
async function nodeExample() {
    const scraper = new NodeScraper();
    
    try {
        const data = await scraper.scrape('/');
        console.log('Scraped data:', data);
        
        // Save to file
        await scraper.saveToFile(data, 'scraped_data.json');
        
    } catch (error) {
        console.error('Scraping error:', error);
    }
}
*/

// Advanced scraper with pagination support
class AdvancedScraper extends BrowserScraper {
    
    // Find pagination links
    findPaginationLinks(doc) {
        const paginationSelectors = [
            '.pagination a',
            '.pager a',
            'a[rel="next"]',
            'a[aria-label*="next"]'
        ];
        
        const links = [];
        
        paginationSelectors.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            Array.from(elements).forEach(link => {
                if (link.href && !links.includes(link.href)) {
                    links.push(link.href);
                }
            });
        });
        
        return links;
    }
    
    // Scrape with automatic pagination
    async scrapeWithPagination(startPath = '/') {
        const allData = [];
        const visitedUrls = new Set();
        const toVisit = [`${this.baseUrl}${startPath}`];
        
        while (toVisit.length > 0) {
            const url = toVisit.shift();
            
            if (visitedUrls.has(url)) continue;
            visitedUrls.add(url);
            
            console.log(`Scraping: ${url}`);
            
            const htmlContent = await this.fetchPage(url);
            if (!htmlContent) continue;
            
            const doc = this.parseHTML(htmlContent);
            const data = this.extractData(doc);
            allData.push({ url, data });
            
            // Find pagination links
            const paginationLinks = this.findPaginationLinks(doc);
            paginationLinks.forEach(link => {
                if (!visitedUrls.has(link) && !toVisit.includes(link)) {
                    toVisit.push(link);
                }
            });
            
            await this.sleep(this.delay);
        }
        
        return allData;
    }
}

// ====================================
// CSV EXPORT FUNCTIONALITY
// ====================================

class CSVExporter {
    // Convert array of objects to CSV string
    static arrayToCSV(data, headers = null) {
        if (!data || data.length === 0) return '';
        
        // Get headers from first object if not provided
        if (!headers) {
            headers = Object.keys(data[0]);
        }
        
        // Escape CSV values
        const escapeCSV = (value) => {
            if (value == null) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        // Create CSV content
        const csvRows = [];
        csvRows.push(headers.map(escapeCSV).join(','));
        
        for (const row of data) {
            const values = headers.map(header => escapeCSV(row[header]));
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
    
    // Flatten nested objects for CSV export
    static flattenObject(obj, prefix = '') {
        const flattened = {};
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = prefix ? `${prefix}_${key}` : key;
                
                if (Array.isArray(obj[key])) {
                    // Convert arrays to comma-separated strings
                    flattened[newKey] = obj[key].join('; ');
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // Recursively flatten nested objects
                    Object.assign(flattened, this.flattenObject(obj[key], newKey));
                } else {
                    flattened[newKey] = obj[key];
                }
            }
        }
        
        return flattened;
    }
    
    // Download CSV file in browser
    static downloadCSV(csvContent, filename = 'scraped_data.csv') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Enhanced BrowserScraper with CSV export
class BrowserScraperWithCSV extends BrowserScraper {
    
    // Export scraped data to CSV format
    exportToCSV(scrapedData, options = {}) {
        const {
            filename = 'scraped_data.csv',
            flattenData = true,
            includeArrays = true,
            customHeaders = null
        } = options;
        
        if (!Array.isArray(scrapedData)) {
            scrapedData = [scrapedData];
        }
        
        // Prepare data for CSV
        const csvData = scrapedData.map((item, index) => {
            let dataRow = {
                index: index + 1,
                url: item.path || item.url || '',
                timestamp: new Date().toISOString()
            };
            
            if (flattenData) {
                // Flatten the nested data structure
                const flatData = CSVExporter.flattenObject(item.data || item);
                dataRow = { ...dataRow, ...flatData };
            } else {
                // Keep basic structure
                dataRow = {
                    ...dataRow,
                    title: item.data?.title || '',
                    headings_count: item.data?.headings?.length || 0,
                    links_count: item.data?.links?.length || 0,
                    paragraphs_count: item.data?.paragraphs?.length || 0,
                    images_count: item.data?.images?.length || 0
                };
            }
            
            return dataRow;
        });
        
        // Generate CSV
        const csvContent = CSVExporter.arrayToCSV(csvData, customHeaders);
        
        // Download in browser
        CSVExporter.downloadCSV(csvContent, filename);
        
        return csvContent;
    }
    
    // Export specific data types to separate CSV files
    exportDetailedCSV(scrapedData) {
        if (!Array.isArray(scrapedData)) {
            scrapedData = [scrapedData];
        }
        
        // Prepare different data types
        const headingsData = [];
        const linksData = [];
        const imagesData = [];
        const paragraphsData = [];
        
        scrapedData.forEach((item, pageIndex) => {
            const pageUrl = item.path || item.url || `page_${pageIndex}`;
            
            // Extract headings
            if (item.data?.headings) {
                item.data.headings.forEach((heading, index) => {
                    headingsData.push({
                        page_url: pageUrl,
                        page_index: pageIndex + 1,
                        heading_index: index + 1,
                        tag: heading.tag,
                        text: heading.text,
                        word_count: heading.text.split(' ').length
                    });
                });
            }
            
            // Extract links
            if (item.data?.links) {
                item.data.links.forEach((link, index) => {
                    linksData.push({
                        page_url: pageUrl,
                        page_index: pageIndex + 1,
                        link_index: index + 1,
                        text: link.text,
                        href: link.href,
                        target: link.target,
                        is_external: link.href.startsWith('http') && !link.href.includes(this.baseUrl)
                    });
                });
            }
            
            // Extract images
            if (item.data?.images) {
                item.data.images.forEach((image, index) => {
                    imagesData.push({
                        page_url: pageUrl,
                        page_index: pageIndex + 1,
                        image_index: index + 1,
                        src: image.src,
                        alt: image.alt,
                        title: image.title,
                        has_alt: !!image.alt
                    });
                });
            }
            
            // Extract paragraphs
            if (item.data?.paragraphs) {
                item.data.paragraphs.forEach((paragraph, index) => {
                    paragraphsData.push({
                        page_url: pageUrl,
                        page_index: pageIndex + 1,
                        paragraph_index: index + 1,
                        text: paragraph,
                        word_count: paragraph.split(' ').length,
                        char_count: paragraph.length
                    });
                });
            }
        });
        
        // Export each data type
        if (headingsData.length > 0) {
            const headingsCSV = CSVExporter.arrayToCSV(headingsData);
            CSVExporter.downloadCSV(headingsCSV, 'headings.csv');
        }
        
        if (linksData.length > 0) {
            const linksCSV = CSVExporter.arrayToCSV(linksData);
            CSVExporter.downloadCSV(linksCSV, 'links.csv');
        }
        
        if (imagesData.length > 0) {
            const imagesCSV = CSVExporter.arrayToCSV(imagesData);
            CSVExporter.downloadCSV(imagesCSV, 'images.csv');
        }
        
        if (paragraphsData.length > 0) {
            const paragraphsCSV = CSVExporter.arrayToCSV(paragraphsData);
            CSVExporter.downloadCSV(paragraphsCSV, 'paragraphs.csv');
        }
    }
    
    // Complete scrape and export workflow
    async scrapeAndExportCSV(paths = ['/'], options = {}) {
        console.log('Starting scrape and CSV export...');
        
        let scrapedData;
        
        if (paths.length === 1) {
            scrapedData = await this.scrape(paths[0]);
            scrapedData = [{ path: paths[0], data: scrapedData }];
        } else {
            scrapedData = await this.scrapeMultiple(paths);
        }
        
        if (!scrapedData || scrapedData.length === 0) {
            console.error('No data scraped');
            return;
        }
        
        // Export main CSV
        this.exportToCSV(scrapedData, options);
        
        // Export detailed CSVs if requested
        if (options.exportDetailed) {
            this.exportDetailedCSV(scrapedData);
        }
        
        console.log('CSV export completed!');
        return scrapedData;
    }
}

// Node.js CSV export (for server-side)
/*
class NodeScraperWithCSV extends NodeScraper {
    
    async exportToCSVFile(scrapedData, filename = 'scraped_data.csv', options = {}) {
        const csvContent = this.prepareCSVData(scrapedData, options);
        
        try {
            await fs.writeFile(filename, csvContent);
            console.log(`CSV data exported to ${filename}`);
        } catch (error) {
            console.error('Error writing CSV file:', error);
        }
    }
    
    prepareCSVData(scrapedData, options = {}) {
        if (!Array.isArray(scrapedData)) {
            scrapedData = [scrapedData];
        }
        
        const csvData = scrapedData.map((item, index) => {
            const flatData = CSVExporter.flattenObject(item.data || item);
            return {
                index: index + 1,
                url: item.path || item.url || '',
                timestamp: new Date().toISOString(),
                ...flatData
            };
        });
        
        return CSVExporter.arrayToCSV(csvData);
    }
}
*/

// ====================================
// UPDATED USAGE EXAMPLES
// ====================================

// Browser example with CSV export
async function browserExampleWithCSV() {
    const scraper = new BrowserScraperWithCSV();
    
    try {
        // Scrape and export to CSV in one go
        await scraper.scrapeAndExportCSV(['/'], {
            filename: 'thechambersj_data.csv',
            flattenData: true,
            exportDetailed: true // This will create separate CSV files for headings, links, etc.
        });
        
        // Or scrape first, then export with custom options
        const data = await scraper.scrapeMultiple(['/', '/about', '/contact']);
        
        // Export flattened data
        scraper.exportToCSV(data, {
            filename: 'all_pages.csv',
            flattenData: true
        });
        
        // Export detailed breakdown
        scraper.exportDetailedCSV(data);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        BrowserScraper, 
        BrowserScraperWithCSV, 
        AdvancedScraper, 
        CSVExporter 
    };
}
browserExampleWithCSV();