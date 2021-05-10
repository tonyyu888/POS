const product_category = new Schema({
    name: String,
    description: String,
    active: Boolean,
    date_added: Date,
    last_update: Date
})

const supplier = new Schema({
    name: String,
    address_1: String,
    address_2: String,
    city: String,
    province: String,
    postal_code: String,
    contact_person: String,
    active: Boolean,
    date_added: Date,
    last_update: Date  
})

const product = new Schema({
    product: {
        name: String,
        description: String,
        category:{
            category_id: ObjectID,
            name: String,
            description: String
        },
        supplier:[{
            supplier_id: ObjectId,
            name: String,
            contact_person: String
        }],
        date_added: Date,
        last_update: Date
    }
})

const customer = new schema({
    first_name: String,
    last_name: String,
    address_1: String,
    address_2: String,
    city: String,
    province: String,
    postal_code: String,
    phone_number: String,
    active: Boolean,
    date_added: Date,
    last_update: Date
})

const order_detail = new Schema({
    order:{
        order_id: ObjectID,
        customer_first_name: String,
        customer_last_name: String
    },
    product:{
        product_id: ObjectID,
        name: String,
        description: String
    },
    quantity: Number,
    date_added: Date,
    last_update: Date
})

const order = new Schema({
    customer:{
        customer_id: ObjectID,
        first_name: String,
        last_name: String
    },
    order_date: Date,
    comment: String,
    details:[
        {order_detail_id: ObjectID,
         product_name: String,
         product_description: String,
         quantity: Number
        }
    ],
    active: Boolean,
    date_added: Date,
    last_update: Date
})

const inventory = new Schema({
    product:{
        product_id: ObjectId,
        name: String,
        description: String
    },
    quantity_on_hand: Number,
    quantity_threshold: Number,  // can use min & max schema types
    active: Boolean,
    date_added: Date,
    last_update: Date
})

const inventory_transaction_type = new Schema({
    name: String,
    description: String,
    active: Boolean,
    date_added: Date,
    last_update: Date
})

const inventory_transaction = new Schema({
    inventory:{
        inventory_id: ObjectID,
        product_name: String,
        product_description: String
    },
    type: {
        inventory_transaction_type_ID: ObjectID,
        name: String,
        description: String
    },
    user:{
        user_id: ObjectID,
        first_name: String,
        last_name: String
    },
    order:{
        order_id: ObjectID,
        customer_first_name: String,
        customer_last_name: String
    },
    quantity: Number,   //postive for addition, negative for withdrawal
    active: Boolean,
    date_added: Date,
    last_update: Date
})


const user = new Schema({
    first_name: String,
    last_name: String,
    password: String,  // encrypt
    type:{
        name: String,  // could be some kind of list
        description: String,
        authority_level: Number
    },
    active: Boolean,
    date_added: Date,
    last_update: Date    
})
