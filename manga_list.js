const COLUMN = { NAME: 0 }

// TODO: Find a hook to start scanning though manga instead of waiting a second.
function main() {
  const mangaList = document.getElementsByClassName("jtable-data-row")
  for (let i = 0; i < mangaList.length; i++) {
    const mangaTitle = mangaList[i].childNodes[COLUMN.NAME].innerText
    console.log(mangaTitle)
  }
}

setTimeout(main, 1000)