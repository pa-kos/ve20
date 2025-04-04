const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public');

// 清理旧的HTML文件
function cleanOldFiles() {
    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            fs.unlinkSync(path.join(OUTPUT_DIR, file));
        }
    });
    console.log('已清理旧HTML文件');
}

cleanOldFiles();