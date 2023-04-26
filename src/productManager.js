import fs from "fs";
if (!fs.existsSync("products.json")) {
    fs.writeFileSync("products.json", "[]");
    }
  class ProductManager {
    
    constructor(path) {
        this.products = [];
        this.path = path
        this.idAutoInc = -1
    }
    async loadDB(){
        try {
            this.products = JSON.parse(fs.readFileSync(this.path))
            if(this.products.length>0){
            this.idAutoInc=this.products[this.products.length-1].id
            }
            
        } catch (error) {
            console.log("Error loaded")
        }
        
    }
    async updateDB(){
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null , 2)) 
        } catch (error) {
            console.log("Error loaded")
        }
    }
    
    async addProduct(title,description,price,thumbnail,code,stock){
        await this.loadDB()
        this.idAutoInc++
        const repeatedProduct = this.products.some(item => item.code === code)
        if(repeatedProduct === false && title && description && price && thumbnail && code && stock){
            this.products.push({
                id:this.idAutoInc,
                title: title,
                description:description,
                price:price,
                thumbnail:thumbnail,
                code:code,
                stock:stock

            })
            await this.updateDB()
            

        }else{
            console.log("Error, duplicated product, or invalid parameters")
        }
    }

    async getProducts(){
        await this.loadDB()
        if(this.products){
            return this.products
        }else{
            console.log("Product list is empty.");
        }
       
    }

    async getProductById(id){
        await this.loadDB()
        const productIfExists = this.products.find(product => product.id === id)
        if(productIfExists){
            return productIfExists
        }else{
            console.log(`Failed to get Product, Product ${id} was not found`)
        }
    }

    async updateProduct(id,parameters){
        await this.loadDB()
        
        const index = this.products.findIndex(product => product.id === id)
        if(index !== -1){
            const parameterTitle=parameters.title ?? this.products[index].title;
            const parameterDescription=parameters.description ?? this.products[index].description;
            const parameterPrice=parameters.price ?? this.products[index].price;
            const parameterThumbnail=parameters.thumbnail ?? this.products[index].thumbnail;
            const parameterCode=parameters.code ?? this.products[index].code;
            const parameterStock=parameters.stock ?? this.products[index].stock;
    
            this.products[index] = {
                id:id,
                title:parameterTitle,
                description:parameterDescription,
                price:parameterPrice,
                thumbnail:parameterThumbnail,
                code:parameterCode,
                stock:parameterStock
            }
            await this.updateDB()
        }else{
            console.log(`Product ${id} was not found`) 
        }
    }

    async deleteProduct(id){
        await this.loadDB()
        const index = this.products.findIndex(product => product.id === id)
        if(index !== -1){
            this.products.splice(index,index+1)
            await this.updateDB()
            console.log("product deleted succesfully")
          }else{
            console.log(`Failed to Delete Product, Product ${id} was not found`)
          }
        }
    }

    const merch = new ProductManager("products.json");
merch.addProduct("SPITFIRE HOODIE BIGHEAD", "Hoddie color naranja, con estampa al frente.", 10.00, "spitfire.jpg", "2Hoddie", 5)
merch.addProduct("SINCOPE DECK KOALA BUONA PASTA 8.25", "Tabla skate Sincope", 15.000, "sincope.jpg","20Deck", 7)
merch.addProduct("TABLA CREATURE GRAPHIC MONSTER MOBILE 8", "Tabla Creature", 21.300, "creature.jpg","21Deck", 3)
merch.addProduct("DECK CLEAVER MARTINEZ KEYS BLANCO", "Tabla skate Cleaver", 18.200, "cleaver.jpg", "22Deck", 9)
merch.addProduct("DECK SANTA CRUZ SALBA TIGER HAND BORDO 9.25", "Tabla Santa Cruz", 30.000, "deckSC.jpg", "23Deck", 8)
merch.addProduct("Nike Air Force one","blanca",30.000,"Nike.jpg","31AirF",15)
merch.addProduct("Vans old","Un clásico",23.000,"VANS.jpg","32Va",23)
merch.addProduct("Vans x NatGeo","Colaboración con NatGeo",20.000,"vansNatGeo.jpg","33VaNG",10)
merch.addProduct("Vans x Simpsons","Colaboración con Simpsons",25.000,"vanSimp.jpg","34VaS",12)
merch.addProduct("Pantalón New Balance Unissentials Swea", "Ofrece una expresión sin género del estilo clásico de esta marca.",15.200, "NewBalancePants.jpg", "35NBPants", 10)
merch.addProduct("Campera adidas originals 3 Stripe Wrap", "Confeccionada en tejido poliéster 100% reciclado, cierre delantero, cuello alzado , bolsillos frontales con cremallera.", 27.00, "camperaAdidas.jpg", "36Adid", 5)

console.log(merch.getProducts())

merch.updateProduct(1,{price:19.000,stock:12});

console.log(merch.getProducts())

merch.deleteProduct(0);

console.log(merch.getProducts())
