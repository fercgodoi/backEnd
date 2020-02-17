const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;


router.get('/listarAll', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente',
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }

                /*const response = {                          //tratando o retorno
                    quantidade: resultado.length,
                    Clientes: resultado.map(cli => {
                        return{
                            id_Cliente: cli.idCli,
                            Nome: cli.nomeCli,
                            cpfCli: cli.cpfCli
                        }
                    })
                }*/

                return res.status(200).send({response: resultado})
            }
        )
    })

});


router.post('/inserirAll', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into cliente(nomeCli, cpfCli, emailCli, telefoneCli, cepCli, estadoCli, cidadeCli, ruaCli, numeroCli, complementoCli, senhaCli)              values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                 [req.body.nomeCli, req.body.cpfCli, req.body.emailCli, req.body.telefoneCli, req.body.cepCli, req.body.estadoCli, req.body.cidadeCli,req.body.ruaCli, req.body.numeroCli, req.body.complementoCli, req.body.senhaCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }

                    return res.status(201).send({                          
                        mensagem: 'Cliente inserido com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});



router.get('/buscar/:cliente', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente where nomeCli = ?;',[req.params.cliente],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado})
            }
        )
    })
});


router.patch('/atualizarAll',(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`update cliente set nomeCli = ? where idCli = ? `,
                 [req.body.nomeCli, req.body.idCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                    return res.status(202).send({                          
                        mensagem: 'Cliente alterado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
})

router.delete('/deletarAll',(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`delete from cliente where idCli = ? `,[req.body.idCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                    return res.status(202).send({                          
                        mensagem: 'Cliente deletado com sucesso',
                        id_Cliente: resultado                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.get('/meuspets/:idCli', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select pet.nomePet, pet.racaPet from pet where idCli = ?',[req.params.idCli],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado})
            }
        )
    })
});


//-----------------------------------------divisor de teste------------------------------------------------------------------


router.post('/test0', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente where emailCli = ?',[req.body.email],
            (error, resultado, fields) => {
                conn.release();
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }

                const resp = {                          //tratando o retorno
                    Clientes: resultado.map(cli => {
                        return{
                            resEmail: cli.emailCli,
                        }
                    })
                }

                return res.status(200).send({response: resp.Clientes})
            }
        )
    })
});

router.get('/test', (req, res, next) => { 
    mysql.getConnection((error, conn) =>{
        if(error){                                              //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente where emailCli = ?;'),[req.body.email],
        (error,result, field) => {
            conn.release();
            if(error){
                return res.status(500).send({ error: error})
            }

           /* const resp = {                          //tratando o retorno
                Clientes: result.map(cli => {
                    return{
                        resEmail: cli.emailCli,
                    }
                })
            }*/

            return res.status(200).send({response: result})           //retorna apenas o primeiro cliente encontrado
        }
    }) 
});

module.exports = router; 
