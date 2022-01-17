import React from 'react'
import styles from './NasaImageStyle.module.css'

export default function NasaImage({handleShowDescription, handleLike, image}) {
    if (image.data === null) {
        return
    }

    function toggleExplanation(e){
        let evenTagName = e.target.tagName
        if (evenTagName !== "path" && evenTagName !== "svg") handleShowDescription(image.id);
    }

    function toggleLike(){
        handleLike(image.id)
    }

    let doubleClicked = false
    function handleDoubleClick(e) {
        switch (e.detail) {
          case 1:
            setTimeout(() => {
                if (!doubleClicked) {
                    toggleExplanation(e)
                }
                doubleClicked = false
            }, 200);
            break;
          case 2:
                toggleLike()
                doubleClicked = true
            break;
        default:
            return;
        }
    }
    const likedHeartClass = image.liked ? styles.heartLiked : '';

    return (
        <div className= {styles.photoContainer}>
            {image.data.media_type === "image" ? (<img
            src={image.data.url}
            alt={image.data.title}
            className= {styles.photo} 
            onClick={handleDoubleClick}
            />
            ):(
                <iframe  src={image.data.url}
                title="nasa-video" 
                frameBorder="0" 
                allowFullScreen 
                allow="encrypted-media" 
                alt={image.data.title}
                className={`${styles.photo} ${styles.iframe}`}
                onClick={handleDoubleClick}>
                </iframe>
            )}

            <div onClick={toggleExplanation} className={styles.infoBox}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 230 230" className={`${styles.heart} ${likedHeartClass}`}
                    onClick={toggleLike}>
                <path d="M213.588,120.982L115,213.445l-98.588-92.463C-6.537,96.466-5.26,57.99,19.248,35.047l2.227-2.083
                    c24.51-22.942,62.984-21.674,85.934,2.842L115,43.709l7.592-7.903c22.949-24.516,61.424-25.784,85.936-2.842l2.227,2.083
                    C235.26,57.99,236.537,96.466,213.588,120.982z"/>
                </svg>
                <h1 className= {styles.title}>{image.data.title}
                </h1>
                <p className= {styles.date} >{image.data.date}</p>
                {image.showDescription ? <p className= {styles.explanation} >{image.data.explanation}</p> :null}
            </div>
        </div>
    );
}
