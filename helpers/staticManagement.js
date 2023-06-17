const fs = require('fs')
const path = require('path');
const uuid = require('uuid')

class staticManagement {
    manyStaticDelete(foundElements) {
        const imagesForDelete = foundElements
        if (imagesForDelete.length) {
            imagesForDelete.map(image => image.image).forEach(image => (
                fs.unlink(path.resolve(__dirname, '..', 'static', image), () => null)
            ))
        }
    }
    manyStaticCreate(images) {
        let imagesNames = [];
        if (images) {
            if (!Array.isArray(images)) images = [images]
            images.forEach(image => {
                if (image.name){
                    const fileName = `${uuid.v4()}.${image.name.split('.').pop()}`
                    imagesNames.push(fileName)
                    image.mv(path.resolve(__dirname, '..', 'static', fileName))
                }
            })
        }
        return imagesNames
    }
    staticDelete(foundElement) {
        if (foundElement){
            fs.unlink(path.resolve(__dirname, '..', 'static', foundElement.image), () => null)
        }
    }
    staticCreate(image) {
        let imageName;
        if (image && image.name) {
            imageName = `${uuid.v4()}.${image.name.split('.').pop()}`
            image.mv(path.resolve(__dirname, '..', 'static', imageName));
        }
        return imageName
    }
}

module.exports = new staticManagement(); 
