import React from 'react'
import NasaImage from './NasaImage'
import styles from './ImagesContainerStyle.module.css'

export default function ImagesContainer({images, handleShowDescription, handleLike}) {
    return (
        <div className={styles.ImagesContainer}>
            {images.map (image =>{
                return <NasaImage image={image} key={image.id} handleShowDescription={handleShowDescription} handleLike={handleLike}></NasaImage>
            })}
        </div>
    )
}
