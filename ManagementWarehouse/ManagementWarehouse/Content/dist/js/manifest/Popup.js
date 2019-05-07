window.addEventListener("click", notifyExtension)
function notifyExtension(e) {
    if (e.target.id !== 'pony') {
        return
    }
    browser.runtime.sendMessage('FooBar')
}