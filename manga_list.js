/* global chrome */

const COLUMN = {
  THUMBNAIL: 0,
  NAME: 1
}

const createThumbnailTd = () => {
  const td = document.createElement('td')
  td.style.alignContent = 'center'

  const thumbnail = new window.Image()
  thumbnail.width = 100
  thumbnail.height = 120

  td.append(thumbnail)
  return td
}

const genMangaDic = (title) => {
  let dic = {}
  dic[title] = { thumbnailSrc: null }
  return dic
}

const getMangaData = (mangaTitle) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(genMangaDic(mangaTitle), function (result) {
      resolve(result[mangaTitle])
    })
  })
}

const saveManga = (title, manga) => {
  let dic = {}
  dic[title] = manga
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(dic, function () {
      resolve(dic[title])
    })
  })
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
    const thumbnailTd = createThumbnailTd()
    mangaTable[rowIndex].insertBefore(thumbnailTd, mangaRow[0])

    const mangaTitle = mangaRow[COLUMN.NAME].innerText
    const mangaUrl = mangaRow[COLUMN.NAME].firstElementChild.href

    getMangaData(mangaTitle).then((mangaData) => {
      if (mangaData.thumbnailSrc === null) {
        fetchMangaThumbnailSrc(mangaUrl).then((thumbnailSrc) => {
          return saveManga(mangaTitle, { thumbnailSrc: thumbnailSrc })
        }).then((mangaData) => {
          thumbnailTd.firstChild.src = mangaData.thumbnailSrc
        })
      } else {
        thumbnailTd.firstChild.src = mangaData.thumbnailSrc
      }
    })
  }
}

setTimeout(main, 1000)
