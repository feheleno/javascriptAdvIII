class NegociacaoDao {
    
    constructor(connection){
        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao){

        return new Promise((resolve, reject) =>{
            
            //let transaction = this._connection.transaction([this._store], 'readwrite');
            //let store = transaction.objectStore(this._store);
            //let request = store.add(negociacao);
            
            //Todas essa etapa de criaçãoo de variáveis acima pode ser encadeada da seguinte forma:

            let request = this._connection
                            .transaction([this._store], 'readwrite')
                            .objectStore(this._store)
                            .add(negociacao);

            request.onsuccess = e => {
                resolve();
            };

            request.onerror = e => {
                console.log();
                reject('Não foi possível adicionar a Negociação.');
            }
        });

    }

    listaTodos(){
        return new Promise((resolve, reject) => {

            let cursor = this._connection
                            .transaction([this._store], 'readwrite')
                            .objectStore(this._store)
                            .openCursor();

            let negociacoes = [];

            cursor.onsuccess = e => {
                let atual = e.target.result;

                if(atual){
                    let dado = atual.value;

                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));

                    atual.continue();
                } else {
                    resolve(negociacoes);
                }
            }

            cursor.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível listar as Negociações.');
            }
        });
    }

}