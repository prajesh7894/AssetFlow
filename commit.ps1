git add package.json package-lock.json vite.config.ts tsconfig*.json index.html postcss.config.js tailwind.config.js .gitignore .oxlintrc.json README.md public
git commit -m "chore(init): phase 1 - initialize react vite project with dependencies"

git add src/main.tsx src/App.tsx src/index.css src/App.css src/lib src/context src/assets src/vite-env.d.ts
git commit -m "feat(core): phase 2 - setup tailwind css and core architecture contexts"

git add src/components
git commit -m "feat(layout): phase 3 - implement main layout and sidebar navigation"

git add src/features/auth
git commit -m "feat(auth): phase 4 - implement authentication login screen"

git add src/features
git commit -m "feat(features): phase 5 - implement core erp modules (dashboard, assets, etc.)"

git add .
git commit -m "chore(config): phase 6 - final polish and unversioned files"
