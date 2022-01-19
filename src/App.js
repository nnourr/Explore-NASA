import ImagesConainer from "./ImagesContainer"
import styles from './appStyles.module.css'
import React, { useState, useEffect } from "react"
// import {isMobile} from 'react-device-detect';

function App() {
	const [images, updateImages] = useState([])
	const LIKES_STORAGE_KEY = "nasaimage.likes"
	const DATE_STORAGE_KEY = "nasaimage.date"
	const NUM_OF_IMAGES_TO_GENERATE = 10
	const apiKey = process.env.REACT_APP_NASA_KEY;
	const lastDate = new Date('1995/06/16')

	function handleShowDescription(id) {
        const newImages = [...images]
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
	
	
	function generateImages() {
		if (images.length !== 0) clearTimeout(generateImageTimeout)

		const offsetDate = images.length !== 0 ? new Date(localStorage.getItem(DATE_STORAGE_KEY)) : new Date()
		const startDate= new Date(offsetDate.toISOString())
		startDate.setDate(startDate.getDate()-NUM_OF_IMAGES_TO_GENERATE)

		if (startDate < lastDate) {console.log("the end of time"); return}

		localStorage.setItem(DATE_STORAGE_KEY, startDate.toISOString())
		console.log(localStorage.getItem(DATE_STORAGE_KEY));
		console.log(startDate.toISOString());
        fetchPhoto();

		async function fetchPhoto() {
			const res = await fetch(
				`https://api.nasa.gov/planetary/apod?start_date=${startDate.toISOString().split("T")[0]}&end_date=${offsetDate.toISOString().split("T")[0]}&api_key=${apiKey}`
			);
			const data = await res.json();
			console.log(data);
			if (!data) return
			const likedPosts = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY))
			for (let i = NUM_OF_IMAGES_TO_GENERATE-1; i >= 0; i--) {
				if (!data[i]) {console.log("unexpected error"); continue}
				let liked = false
				if (likedPosts && likedPosts.includes(data[i].url)) liked = true
				updateImages( prevImages=> {
					return [...prevImages, {data:data[i], showDescription:false, id:data[i].url, liked:liked}]
				})
			}
		}
	}
	
	let generateImageTimeout;

	function loadOnScroll(e) {
		// const scrollThreshold = isMobile? 100:1
		const bottom = Math.abs(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) <= 1;
		console.log("scroll height: " + e.target.scrollHeight);
		console.log("scroll top: " + e.target.scrollTop);
		console.log("clientHeight: " + e.target.clientHeight);
		let timeOut = false
		if (bottom && !timeOut) {
			generateImageTimeout = setTimeout(() => {
				generateImages()
				timeOut = true
			}, 100);
		}
	}


    useEffect(() => {
		generateImages()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
	<>
		<div className={styles.stars}></div>
		<div className={styles.clouds}></div>
		<div className={styles.twinkling}></div>
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
