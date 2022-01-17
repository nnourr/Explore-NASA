import ImagesConainer from "./ImagesContainer"
import styles from './appStyles.module.css'
import React, { useState, useEffect } from "react"
import {isMobile} from 'react-device-detect';

function App() {
	const [images, updateImages] = useState([])
	const LIKES_STORAGE_KEY = "nasaimage.likes"
	const DATE_STORAGE_KEY = "nasaimage.date"
	const NUM_OF_IMAGES_TO_GENERATE = 10

	function handleShowDescription(id) {
        const newImages = [...images]
		console.log(newImages);
        const image = newImages.find(image => image.id === id)
        image.showDescription = !image.showDescription
        updateImages(newImages)
    }

	function handleLike(id) {
        const newImages = [...images]
        const image = newImages.find(image => image.id === id)
        image.liked = !image.liked
		let likedArray = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY))
		if (likedArray === null) {
			likedArray = []
		}
		if (image.liked) {
			likedArray.push(image.data.url)
		} else {
			likedArray.splice(likedArray.indexOf(image.data.url))
		}
		localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedArray))
        updateImages(newImages)
	}
	
	const apiKey = process.env.REACT_APP_NASA_KEY;
	
	function generateImages(numOfImages) {
		const offsetDate = images.length > 0 ? new Date(localStorage.getItem(DATE_STORAGE_KEY)) : new Date()
		offsetDate.setDate(offsetDate.getDate()-images.length)
		const startDate= new Date(offsetDate.toISOString())
		startDate.setDate(startDate.getDate()-numOfImages + 1)

        fetchPhoto();
		localStorage.setItem(DATE_STORAGE_KEY, startDate.toISOString())

		async function fetchPhoto() {
			const res = await fetch(
				`https://api.nasa.gov/planetary/apod?start_date=${startDate.toISOString().split("T")[0]}&end_date=${offsetDate.toISOString().split("T")[0]}&api_key=${apiKey}`
			);
			const data = await res.json();
			const likedPosts = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY))
			for (let i = numOfImages-1; i >= 0; i--) {
				let liked = false
				if (likedPosts && likedPosts.includes(data[i].url)) liked = true
				updateImages( prevImages=> {
					return [...prevImages, {data:data[i], showDescription:false, id:data[i].url, liked:liked}]
				})
			}
		}
	}
	
	function loadOnScroll(e) {
		const scrollThreshold = isMobile? 100:1
		const bottom = Math.abs(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) <= scrollThreshold;
		let timeOut = false
		if (bottom && !timeOut) {
			timeOut = true
			generateImages(NUM_OF_IMAGES_TO_GENERATE)
			setTimeout(() => {
				timeOut = false
			}, 10000);
		}
	}


    useEffect(() => {
		generateImages(NUM_OF_IMAGES_TO_GENERATE)
		const currDate = new Date()
		localStorage.setItem(DATE_STORAGE_KEY, currDate.toISOString())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
	<>
		<div className={styles.handleScrolling} onScroll={loadOnScroll}>
			<div className={styles.container}>
				<h1 className={styles.title}>Explore NASA</h1>
				<p className={styles.description}>Scroll through NASA's images of the day!</p>
				<p className={styles.description}>Click to show description, double click to like.</p>
				<ImagesConainer images={images} handleShowDescription={handleShowDescription} handleLike={handleLike}/>
			</div>
			<div className={styles.loading}></div>
		</div>
	</>
  );
}

export default App;
