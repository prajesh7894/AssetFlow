const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('alert(')) {
    content = content.replace(/alert\(/g, 'toast.error('); // Or toast.success for some cases, let's just use toast( for now, but toast.error is safer for catches.
    // Let's refine the replace logic
    // Usually it's alert("success message") or alert("error message").
    // We can just use toast() for both and let it be default toast, or try to be smart.
    // For simplicity, let's just replace `alert(` with `toast(`
    content = content.replace(/toast\.error\(/g, 'toast('); 
    
    // Check if toast is imported
    if (!content.includes('import { toast } from "sonner";') && !content.includes("import { toast } from 'sonner';")) {
      content = `import { toast } from "sonner";\n` + content;
    }
    changed = true;
  }

  // We already changed Dashboard.tsx manually and added toast.success / toast.error without import. Let's fix missing imports.
  if (content.includes('toast.') || content.includes('toast(')) {
    if (!content.includes('import { toast } from "sonner";') && !content.includes("import { toast } from 'sonner';")) {
      content = `import { toast } from "sonner";\n` + content;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
