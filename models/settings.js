import { Schema, model, models } from "mongoose"

const PrivacySettingSchema = new Schema({
    hideEmail: {
        type: Boolean,
        default: false
    }
}, { _id: false })
const PreferenceSettingSchema = new Schema({
    customUsername: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        trim: true,
        unique: [true, "Username already exists!"],
        partialFilterExpression: {
            username: {
                $type: "string"
            }
        }
    }
}, { _id: false })

const SettingsSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    privacy: {
        type: PrivacySettingSchema,
        required: true
    },
    preference: {
        type: PreferenceSettingSchema,
        required: true
    }
})

const Settings = models.Settings || model("Settings", SettingsSchema)
export default Settings