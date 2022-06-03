export const covid = (mongoose) => {
    const schema = mongoose.Schema(
        {
            penambahan: Object,
            total: Object,
            logHistory: Object
        },
        { timestamps: true }
    )
    // mengubah _id menjadi id
    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    const Data = mongoose.model("data", schema, "data")
    return Data
}