import { currencies } from "@/lib/tools"

export const validateName = (name: string, harsh = false) => {
    if (name.length === 0) {
        if (harsh) return "Name is required"
        return null
    }
    if (name.length < 3 || name.length > 50)
        return "Name must be between 3 and 50 characters"
    return null
}

export const validateDescription = (description: string, harsh = false) => {
    if (description.length > 3_500)
        return "Description must be at most 3,500 characters"
    return null
}

export const validatePrice = (
    price: number,
    currency: string,
    harsh = false,
) => {
    if (price === null && !harsh) return null
    if (!price && harsh) return "Price is required"
    if (price < 0) return "Price must be positive"
    // check if currency is valid
    if (!currencies.find((c) => c.name === currency)) return "Invalid currency"
    // too expensive (> 10k)
    if (price > 10_000) return "Price must be less than $10,000"
    return null
}

export const validateImages = (images: string[]) => {
    if (images.length > 10) return "Maximum of 10 images allowed"
    return null
}

export const validateTags = (tags: string[]) => {
    if (tags.length > 10) return "Maximum of 10 tags allowed"
    // each tag must be between 1 and 20 characters
    for (const tag of tags) {
        if (tag.length < 1 || tag.length > 20)
            return "Tags must be between 1 and 10 characters"
    }
    return null
}
