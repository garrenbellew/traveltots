import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

