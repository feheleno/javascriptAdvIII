var ConnectionFactory = (function () {
    let stores = ['negociacoes'];
    let version = 3;
    let dbName = 'aluraframe';

    let connection = null;

    let close;

    return class ConnectionFactory {

        constructor() {
            throw new Error('Não é possível criar instâncias de ConnectionFactory!');
        }

        static getConnection() {
            return new Promise((resolve, reject) => {
                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {
                    ConnectionFactory._createStores(e.target.result);
                };

                openRequest.onsuccess = e => {
                    if (!connection) {
                        connection = e.target.result;
                        //ao invés de usar o bind aqui podemos utilizar um Reflect no método closeConnection
                        //e atribuir diretamente o método connection.close à variável close, como abaixo.
                        //close = connection.close;
                        close = connection.close.bind(connection);
                        connection.close = function () {
                            throw new Error('connection.close() não pode ser chamado diretamente.');
                        }
                    }
                    resolve(connection);
                };

                openRequest.onerror = e => {
                    console.log(e.target.error);
                    reject(e.target.error.name);
                };
            });
        }

        static _createStores(connection) {
            stores.forEach(store => {
                if (connection.objectStoreNames.contains(store)) {
                    connection.deleteObjectStore(store);
                }
                connection.createObjectStore(store, {
                    autoIncrement: true
                });
            });
        }

        static closeConnection(connection) {
            if (connection) {
                //Reflect.apply(close, connection, []);
                close();
                connection = null;
            }
        }
    }
})();