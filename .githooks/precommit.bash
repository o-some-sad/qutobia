p=`pwd`
{
    cd packages/backend
    pnpm eslint . --fix
};
if [[ "$?" -ne 0 ]]; then
    exit 1
fi
cd $p
{
    cd packages/frontend
    pnpm ng build
}
if [[ "$?" -ne 0 ]]; then
    exit 1
fi
