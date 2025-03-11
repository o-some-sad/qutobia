# Kotobia



















# Development instructions
> [!IMPORTANT]  
> Please read this section carefully

1. run this command to ensure running pre-commit hooks
```sh
git config --local core.hooksPath .githooks/
```
2. install required packages  
_if you don't have pnpm installed on your system please follow [this guide](https://pnpm.io/installation)_
```sh
pnpm install
```
3. run both backend and frontend server
```sh
# back
cd packages/backend
pnpm start
```

```sh
# front
cd packages/frontend
pnpm start
```