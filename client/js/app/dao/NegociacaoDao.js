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

}