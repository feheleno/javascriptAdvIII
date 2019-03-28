class HttpService {
    
    _handleErrors(res) {
        if (!res.ok) throw new Error(res.statusText);
        return res;
    }

    get(url) {

        return fetch(url)
                    .then(res => this._handleErrors(res))
                    .then(res => res.json());
        
        // O ES6 implementou um método muito mais fácil (acima) de pegar conteúdo de páginas.
        // esse código abaixo está sendo mantido comentado apenas para fins educativos.
        //
        // return new Promise((resolve, reject) => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.open('GET', url);
        //     xhr.onreadystatechange = () => {
        //         if(xhr.readyState == 4) {
        //             if(xhr.status == 200) {   
        //                 resolve(JSON.parse(xhr.responseText));  
        //             } else {
        //                 reject(xhr.responseText);
        //             }
        //         }
        //     };
        //     xhr.send();
        // });
    }
}