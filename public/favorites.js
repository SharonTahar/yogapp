
fetch('/getAllPoses' )
.then(response => response.json())
.then(data => {
    getmyData(data);
    })
.catch(error => {
  console.log(error)
});

let favoriteDiv = document.getElementById("rootfavor");

const getmyData = (data) =>{
    for ( i in data) {
        if (data[i].users_id > 0) {
            let box = document.createElement('div')
            favoriteDiv.setAttribute('class', 'card');
            box.className = 'box'
            box.setAttribute('class', 'target');
    
            let english = document.createElement('h3')
            english.innerHTML = data[i].english_name
    
            let sanskrit = document.createElement('h2')
            sanskrit.innerHTML = data[i].sanskrit_name
    
            let img = document.createElement('img')
            img.setAttribute('src', data[i].img_url)
    
            box.appendChild(english)
            box.appendChild(sanskrit)
            box.appendChild(img)
            favoriteDiv.appendChild(box)

    }
    }
}