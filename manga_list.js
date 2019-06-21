const COLUMN = {
  NAME: 0
}

const fetchHTML = (url) => {
  return new Promise((resolve, reject) => {
    window.fetch(url).then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('Non 200 range status code recieved.'))
      }
      return response.text()
    }).then(htmlString => {
      const doc = new window.DOMParser().parseFromString(htmlString, 'text/html')
      resolve(doc)
    }).catch(error => {
      reject(error)
    })
  })
}

const fetchMangaThumbnailSrc = (mangaUrl) => {
  return new Promise((resolve, reject) => {
    fetchHTML(mangaUrl).then(doc => {
      try {
        const mangaThumbnailSrc = doc.getElementsByClassName('thumbnail')[0].src
        resolve(mangaThumbnailSrc)
      } catch (error) {
        return Promise.reject(error)
      }
    }).catch(error => {
      return reject(error)
    })
  })
}

// TODO: Find a hook to start scanning though the manga table instead of waiting a second.
const main = () => {
  const mangaTable = document.getElementsByClassName('jtable-data-row')
  for (const rowIndex in mangaTable) {
    const mangaRow = mangaTable[rowIndex].childNodes
    const mangaTitle = mangaRow[COLUMN.NAME].innerText
    const mangaUrl = mangaRow[COLUMN.NAME].firstElementChild.href

    fetchMangaThumbnailSrc(mangaUrl).then(thumbnailSrc => {
      console.log(thumbnailSrc)
      console.log(mangaTitle)
    }).catch(error => {
      console.error(error)
    })
  }
}

setTimeout(main, 1000)
