const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const { nanoid } = require('nanoid');

// 配置
const TEMPLATE_PATH = path.join(__dirname, '../templates/template.html');
const MD_PATH = path.join(__dirname, '../content/input.md');
const OUTPUT_DIR = path.join(__dirname, '../public');

// 生成随机文件名 (8位字母数字)
function generateFilename() {
    return nanoid(8).toLowerCase() + '.html';
}

// 处理Markdown内容
function processMarkdown(content) {
    // 提取标题
    const titleMatch = content.match(/本期标题：(.*)/);
    const title = titleMatch ? titleMatch[1].trim() : '默认标题';

    // 转换Markdown为HTML
    let html = md.render(content);

    // 添加复制按钮功能
    html = html.replace(/(https?:\/\/[^\s]+)/g, (match) => {
        return `
        <div class="link-section">
            ${match}<br>
            <button class="copy-btn" onclick="copyToClipboard('${match}')">一键复制</button>
        </div>
        `;
    });

    // 替换点击查看链接
    html = html.replace(/点击查看（这个点击查看可跳转）/g, '<a href="$1" target="_blank">点击查看</a>');

    return { title, html };
}

// 主函数
function main() {
    // 读取Markdown内容
    const mdContent = fs.readFileSync(MD_PATH, 'utf-8');
    
    // 处理内容
    const { title, html } = processMarkdown(mdContent);
    
    // 读取模板
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    template = template
        .replace('{{title}}', title)
        .replace('{{{content}}}', html);
    
    // 生成输出文件
    const filename = generateFilename();
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), template);
    
    console.log(`生成成功: ${filename}`);
    console.log(`访问链接: https://your-vercel-app.vercel.app/${filename}`);
}

main();