import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('Upload endpoint called')
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    console.log('File received:', file ? { name: file.name, size: file.size, type: file.type } : 'null')

    if (!file) {
      console.error('No file provided')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large (max 5MB)' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try Cloudinary first if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        console.log('Uploading to Cloudinary')
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'traveltots/products',
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          ).end(buffer)
        })
        
        console.log('Upload successful to Cloudinary:', result)
        
        return NextResponse.json({
          success: true,
          url: (result as any).secure_url,
          fileName: (result as any).public_id,
        })
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError)
        // Fall through to local filesystem
      }
    }

    // Fallback to local filesystem
    console.log('Using local filesystem for upload')
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'products')
    console.log('Upload directory:', uploadDir)
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory')
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${sanitizedFileName}`
    const filePath = join(uploadDir, fileName)
    
    console.log('Writing file to:', filePath)

    // Write file
    await writeFile(filePath, buffer)
    console.log('File written successfully')

    // Return the public URL
    const publicUrl = `/products/${fileName}`
    console.log('Upload successful, returning URL:', publicUrl)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

