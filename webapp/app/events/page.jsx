'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import {
    Calendar,
    CalendarDays,
    Upload,
    Image as ImageIcon,
    RefreshCw,
    Heart,
    Check,
    X,
    Eye,
    Download,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const API_BASE_URL = 'http://localhost:8080'

// Form validation schema
const eventFormSchema = z.object({
    eventName: z.string().min(1, 'Event name is required').min(3, 'Event name must be at least 3 characters'),
    eventDescription: z.string().min(1, 'Event description is required').min(10, 'Description must be at least 10 characters'),
    eventDate: z.string().min(1, 'Event date is required'),
    image: z.any().refine((files) => files?.length > 0, 'Image is required')
})

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp']

export default function EventManager() {
    const [healthStatus, setHealthStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [images, setImages] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [selectedImageDialog, setSelectedImageDialog] = useState(null)
    const [imagesLoading, setImagesLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            eventName: '',
            eventDescription: '',
            eventDate: '',
            image: null
        }
    })

    // API Functions
    const checkHealth = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`)
            const data = await response.json()
            setHealthStatus({ status: 'healthy', data })
            return true
        } catch (error) {
            setHealthStatus({ status: 'unhealthy', error: error.message })
            return false
        }
    }, [])

    const createEvent = async (formData) => {
        try {
            setIsLoading(true)
            setUploadProgress(10)

            const response = await fetch(`${API_BASE_URL}/event/create`, {
                method: 'POST',
                body: formData
            })

            setUploadProgress(50)
            const data = await response.json()
            setUploadProgress(100)

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create event')
            }

            toast.success('Event created successfully!', {
                description: `Event "${data.data?.eventName}" has been created.`
            })

            form.reset()
            setImagePreview(null)
            await fetchImages() // Refresh images list

            return data
        } catch (error) {
            toast.error('Failed to create event', {
                description: error.message
            })
            throw error
        } finally {
            setIsLoading(false)
            setUploadProgress(0)
        }
    }

    const uploadImageOnly = async (formData) => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_BASE_URL}/upload/image`, {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload image')
            }

            toast.success('Image uploaded successfully!')
            await fetchImages() // Refresh images list

            return data
        } catch (error) {
            toast.error('Failed to upload image', {
                description: error.message
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const fetchImages = async () => {
        try {
            setImagesLoading(true)
            const response = await fetch(`${API_BASE_URL}/images`)

            if (!response.ok) {
                throw new Error('Failed to fetch images')
            }

            const data = await response.json()
            setImages(data.success ? data.data || [] : [])
        } catch (error) {
            toast.error('Failed to fetch images', {
                description: error.message
            })
            setImages([])
        } finally {
            setImagesLoading(false)
        }
    }

    // Event Handlers
    const onSubmit = async (values) => {
        const formData = new FormData()
        formData.append('eventName', values.eventName)
        formData.append('eventDescription', values.eventDescription)
        formData.append('eventDate', values.eventDate)

        if (values.image?.length > 0) {
            formData.append('image', values.image[0])
        }

        await createEvent(formData)
    }

    const handleImageChange = (event) => {
        const files = event.target.files
        if (files?.length > 0) {
            const file = files[0]

            // Validate file type
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast.error('Invalid file type', {
                    description: 'Please select a PNG, JPG, JPEG, GIF, or WebP image.'
                })
                return
            }

            // Validate file size (optional - limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File too large', {
                    description: 'Please select an image smaller than 10MB.'
                })
                return
            }

            form.setValue('image', files)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const handleQuickImageUpload = async (event) => {
        const files = event.target.files
        if (files?.length > 0) {
            const formData = new FormData()
            formData.append('image', files[0])
            await uploadImageOnly(formData)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Effects
    useEffect(() => {
        checkHealth()
        fetchImages()
    }, [checkHealth])

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Event Management Service</h1>
                    <p className="text-muted-foreground">Test and interact with your Event Management API</p>
                </div>

                {/* Health Status */}
                <div className="flex items-center gap-2">
                    <Badge
                        variant={healthStatus?.status === 'healthy' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                    >
                        <Heart className={`w-3 h-3 ${healthStatus?.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
                        {healthStatus?.status === 'healthy' ? 'Service Healthy' : 'Service Unhealthy'}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={checkHealth}
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Check
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="create-event" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="create-event">Create Event</TabsTrigger>
                    <TabsTrigger value="quick-upload">Quick Upload</TabsTrigger>
                    <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
                </TabsList>

                {/* Create Event Tab */}
                <TabsContent value="create-event">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="w-5 h-5" />
                                Create New Event
                            </CardTitle>
                            <CardDescription>
                                Create a new event with an image upload. All fields are required.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="eventName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Event Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter event name"
                                                                {...field}
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="eventDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Event Date</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                {...field}
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="eventDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Event Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Enter event description"
                                                                className="min-h-[120px]"
                                                                {...field}
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Event Image</FormLabel>
                                                        <FormControl>
                                                            <div className="space-y-4">
                                                                <Input
                                                                    type="file"
                                                                    accept=".png,.jpg,.jpeg,.gif,.webp"
                                                                    onChange={handleImageChange}
                                                                    disabled={isLoading}
                                                                    className="cursor-pointer"
                                                                />
                                                                {imagePreview && (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={imagePreview}
                                                                            alt="Preview"
                                                                            className="w-full h-48 object-cover rounded-md border"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="absolute top-2 right-2"
                                                                            onClick={() => {
                                                                                setImagePreview(null)
                                                                                form.setValue('image', null)
                                                                            }}
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Accepted formats: PNG, JPG, JPEG, GIF, WebP (max 10MB)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {uploadProgress > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Upload Progress</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <Progress value={uploadProgress} className="w-full" />
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4" />
                                            )}
                                            Create Event
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                form.reset()
                                                setImagePreview(null)
                                            }}
                                            disabled={isLoading}
                                        >
                                            Reset Form
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quick Upload Tab */}
                <TabsContent value="quick-upload">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Quick Image Upload
                            </CardTitle>
                            <CardDescription>
                                Upload images directly without creating an event
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">Drop images here or click to upload</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, JPEG, GIF, WebP up to 10MB</p>
                                </div>
                                <Input
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.gif,.webp"
                                    onChange={handleQuickImageUpload}
                                    disabled={isLoading}
                                    className="mt-4 cursor-pointer"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Image Gallery
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchImages}
                                    disabled={imagesLoading}
                                    className="flex items-center gap-1"
                                >
                                    <RefreshCw className={`w-3 h-3 ${imagesLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                View all uploaded images and their metadata
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {imagesLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="ml-2">Loading images...</span>
                                </div>
                            ) : images.length === 0 ? (
                                <div className="text-center py-8">
                                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-lg font-medium">No images found</p>
                                    <p className="text-sm text-gray-500">Upload some images to see them here</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {images.map((image, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <div className="aspect-video relative">
                                                <img
                                                    src={`${API_BASE_URL}/image/${image.filename || image.name}`}
                                                    alt={image.filename || image.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.png'
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="secondary" size="sm">
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl">
                                                            <DialogHeader>
                                                                <DialogTitle>{image.filename || image.name}</DialogTitle>
                                                                <DialogDescription>
                                                                    Full size image preview
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="flex justify-center">
                                                                <img
                                                                    src={`${API_BASE_URL}/image/${image.filename || image.name}`}
                                                                    alt={image.filename || image.name}
                                                                    className="max-w-full max-h-96 object-contain"
                                                                />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                            <CardContent className="p-3">
                                                <h3 className="font-medium truncate" title={image.filename || image.name}>
                                                    {image.filename || image.name}
                                                </h3>
                                                <div className="text-xs text-gray-500 space-y-1 mt-2">
                                                    {image.size && <p>Size: {formatFileSize(image.size)}</p>}
                                                    {image.uploadDate && (
                                                        <p>Uploaded: {new Date(image.uploadDate).toLocaleDateString()}</p>
                                                    )}
                                                    {image.type && <p>Type: {image.type}</p>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Service Status Alert */}
            {healthStatus?.status === 'unhealthy' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Service Unavailable</AlertTitle>
                    <AlertDescription>
                        Unable to connect to the Event Management Service at {API_BASE_URL}.
                        Please ensure the service is running and accessible.
                        <br />
                        <strong>Error:</strong> {healthStatus.error}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
