function handleCopy(event: any, content: string) {
  event.clipboardData.setData('text/html', content)
  event.clipboardData.setData('text/plain', content)

  event.preventDefault()
}

export const copyToClipboard = async (content: string): Promise<void> => {
  try {
    const data = [new ClipboardItem({ 'text/html': content }), new ClipboardItem({ 'text/plain': content })]

    await navigator.clipboard.write(data)
  } catch {
    document.addEventListener('copy', (e) => handleCopy(e, content))
    document.execCommand('copy')
    document.removeEventListener('copy', (e) => handleCopy(e, content))
  }
}
