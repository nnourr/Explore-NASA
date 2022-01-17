import ImagesConainer from "./ImagesContainer"
import styles from './appStyles.module.css'
import React, { useState, useEffect } from "react"
import uuidv4 from 'uuid/v4'

function App() {
    const [images, updateImages] = useState([])

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
        updateImages(newImages)
	}
	
	const apiKey = process.env.REACT_APP_NASA_KEY;
	


	function generateImages(numOfImages) {
		const offsetDate = new Date()
		offsetDate.setDate(offsetDate.getDate()-images.length)
		const startDate= new Date(offsetDate.toISOString())
		startDate.setDate(startDate.getDate()-numOfImages + 1)

        fetchPhoto();

		async function fetchPhoto() {
			const res = await fetch(
				`https://api.nasa.gov/planetary/apod?start_date=${startDate.toISOString().split("T")[0]}&end_date=${offsetDate.toISOString().split("T")[0]}&api_key=${apiKey}`
			);
			const data = await res.json();
			for (let i = numOfImages-1; i >= 0; i--) {
				updateImages( prevImages=> {
					return [...prevImages, {data:data[i], showDescription:false, id:uuidv4(), liked:false}]
				})
			}
		}

	}
	
	function loadOnScroll(e) {
		const bottom = Math.abs(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) <= 1;
		let timeOut = false
		if (bottom && !timeOut) {
			generateImages(10)
			timeOut = true
			setTimeout(() => {
				timeOut = false
			}, 10000);
		}
	}
	
    useEffect(() => {
		generateImages(10)
	}, [])
	return (
	<>
		<div className={styles.handleScrolling} onScroll={loadOnScroll}>
			<div className={styles.container}>
				<h1 className={styles.title}>Explore NASA</h1>
				<div className={styles.description}>Scroll through NASA's images of the day!</div>
				<div className={styles.description}>Click to show description, double click to like.</div>
				<ImagesConainer images={images} handleShowDescription={handleShowDescription} handleLike={handleLike}/>
			</div>
			<div className={styles.loading}></div>
		</div>
	</>
  );
}

export default App;
