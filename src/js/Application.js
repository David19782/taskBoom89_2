import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading = document.getElementsByTagName('progress')[0];
    this.data = [];
    this._load().then((data) => {
      this._create();

    }).then(() => {
      this.emit(Application.events.READY);

    })
    //console.log(this.data)
  }

  async _load() {
    this._startLoading();
    const res = await fetch("https://swapi.boom.dev/api/planets"); 
    const first =  await res.json();
    //console.log(first)
    this.data.push(...first.results)
    const pages = 6;
    for(let i = 2; i <= pages; i++){
      const url = `https://swapi.boom.dev/api/planets/?page=${i}`;
      //console.log(url);
      const curr = await (await fetch(url)).json();
      this.data.push(...curr.results);
    }
    this._stopLoading();
    //console.log(this.data);

  }
  _create() {

    this.data.forEach(el => {
      
      let  box = document.createElement('div');
      box.classList.add("box");
      
      console.log(box);
      box.innerHTML = this._render({
        name: el.name,
        terrain: el.terrain,
        population: el.population
      })
      document.getElementsByTagName("div")[0].appendChild(box);
    })
  }
  _startLoading() {
    this._loading.style.display = "inline";
  }

  _stopLoading() {
    this._loading.style.display = 'none';
  }

  _render({ name, terrain, population }) {
    return `
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img src="${image}" alt="planet">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
          <h4>${name}</h4>
            <p>
              <span class="tag">${terrain}</span> <span class="tag">${population}</span>
              <br>
            </p>
          </div>
        </div>
      </article>
      `;
  }
}
