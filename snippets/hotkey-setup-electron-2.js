app.whenReady().then(() => {
    createWindow();
    
    globalShortcut.register('Ctrl+y', () => {
        win.isVisible() ? win.hide() : win.show();
    });
});