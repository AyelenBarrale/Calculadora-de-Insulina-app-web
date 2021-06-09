

let alimentosArray =[];

const listContainer = document.getElementById("list-container")
const alimentos = document.getElementById("alimentos")
const tablaFooter = document.getElementById("tablaFooter")
const searchContainer = document.getElementById("searchContainer")
const search = document.getElementById("searchInput")
const btnBuscar = document.getElementById("btnBuscar")

const templateAlimento = document.getElementById("template-alimento").content
const templateFooter = document.getElementById("template-footer").content
const templateListado = document.getElementById("template-listado").content

const fragment = new DocumentFragment()

let listado = {}


////////////

document.addEventListener("DOMContentLoaded" , () => {
    fetchData()
    if(localStorage.getItem("Listado")) {
        listado = JSON.parse(localStorage.getItem("Listado"))
        mostrarListado()
    }
} )


listContainer.addEventListener( "click" , event => {
    addList(event) 
})

alimentos.addEventListener( "click" , event => {
    btnsAccion(event)
})

searchContainer.addEventListener("click" , () => {
    mostrarAlimentos(alimentosArray)
})


search.addEventListener("keyup" , (dato) => {
    const ingreso = dato.target.value.toLowerCase()
    
    const listadoFiltrado = alimentosArray.filter(alimento => {
        return alimento.nombre.includes(ingreso)
    })

    mostrarAlimentos(listadoFiltrado)
})

////////////

const fetchData = async () => {
    try {
        const res = await fetch("alimentos.json")
        const data = await res.json()

        alimentosArray = data 
        //mostrarAlimentos(alimentosArray)
        
        } catch (error) {
        console.log(error)
    }
}
const mostrarAlimentos = (array) => {

    listContainer.innerHTML = "";
    
    array.forEach(alimento => {
        listContainer.classList.add("active")
        templateAlimento.querySelector(".nombre").textContent = alimento.nombre
        templateAlimento.querySelector(".porcion").textContent = alimento.porcion
        templateAlimento.querySelector(".carbs").textContent = alimento.carb
        templateAlimento.querySelector(".btnListar").dataset.id = alimento.id

        const clone = templateAlimento.cloneNode(true)
        fragment.appendChild(clone)
    })

    listContainer.appendChild(fragment)
}


const addList = event => {
    console.log(event)
    if(event.target.classList.contains("btnListar")) {
        completarListado(event.target.parentElement)
    }

    //event.stopPropagation()

    search.value = "";
    listContainer.innerHTML = "";
}

const completarListado = objeto => {
   
    const alimento = {
        id: objeto.querySelector(".btnListar").dataset.id,
        nombre: objeto.querySelector(".nombre").textContent,
        carb: objeto.querySelector(".carbs").textContent,
        porciones: 1
    }

    if(listado.hasOwnProperty(alimento.id)) {
        alimento.porciones = listado[alimento.id].porciones + 1
    }

    listado[alimento.id] = {...alimento}
    console.log(listado)

    mostrarListado()
}

const mostrarListado = () => {

    alimentos.innerHTML = "";

    Object.values(listado).forEach( alimento => {
        templateListado.querySelectorAll("td")[0].textContent = alimento.nombre
        templateListado.querySelectorAll("td")[1].textContent = alimento.porciones
        templateListado.querySelector(".btnSumar").dataset.id = alimento.id
        templateListado.querySelector(".btnRestar").dataset.id = alimento.id
        templateListado.querySelector(".carbSum").textContent = alimento.porciones * alimento.carb

        const clone = templateListado.cloneNode(true)

        fragment.appendChild(clone)
    })

    alimentos.appendChild(fragment)

    mostrarFooter()

    localStorage.setItem("Listado" , JSON.stringify(listado) )
}



const mostrarFooter = () => {

    tablaFooter.innerHTML = ""
    if(Object.keys(listado).length === 0) {
        tablaFooter.innerHTML = `
        <th scope="row" colspan="5">Listado vacío - Comienza a cargar tus alimentos</th>
        `
        return
    }

    const nCarbs = Object.values(listado).reduce((acc, {porciones , carb}) => acc + porciones * carb,0)

    let dosis = 15

    const nDosis = Math.round(nCarbs/dosis) 



    templateFooter.querySelector(".spanCarbs").textContent = nCarbs
    templateFooter.querySelector(".totalDosis").textContent = nDosis

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    tablaFooter.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciarListado")
    btnVaciar.addEventListener(("click") , () => {
        listado = {}
        mostrarListado()
    })
}

const btnsAccion = event => {
    if(event.target.classList.contains("btnSumar")) {
        const alimento = listado[event.target.dataset.id]
        alimento.porciones++

        listado[event.target.dataset.id] = {...alimento}
        mostrarListado()

    }

    if(event.target.classList.contains("btnRestar")) {
        const alimento = listado[event.target.dataset.id]
        alimento.porciones--
        if(alimento.porciones === 0) {
            delete listado[event.target.dataset.id]
        }

        mostrarListado()
    }

    event.stopPropagation()
}
