// docker/api-server.js
const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 9000;

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Save workspace endpoint
app.post('/api/save-workspace', async (req, res) => {
  const interviewTakenId = process.env.INTERVIEW_TAKEN_ID;
  const bucket = process.env.AWS_BUCKET;
  
  if (!interviewTakenId) {
    return res.status(400).json({ 
      error: 'INTERVIEW_TAKEN_ID environment variable not set' 
    });
  }

  try {
    const workspaceDir = '/home/ubuntu/interviewer-env';
    const timestamp = Date.now();
    const zipPath = `/tmp/workspace-${timestamp}.zip`;
    
    console.log(`🗜️ Creating workspace archive from ${workspaceDir}...`);
    
    // Create zip archive
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { 
      zlib: { level: 9 } // Maximum compression
    });
    
    // Handle archive events
    archive.on('error', (err) => {
      throw err;
    });
    
    archive.on('end', () => {
      console.log(`📦 Archive created: ${archive.pointer()} bytes`);
    });
    
    archive.pipe(output);
    
    // Add workspace directory to archive, excluding common unnecessary files
    archive.glob('**/*', {
      cwd: workspaceDir,
      ignore: [
        'node_modules/**',
        '.git/**',
        'dist/**',
        'build/**',
        '.next/**',
        'coverage/**',
        '*.log',
        '.env*',
        '.DS_Store',
        'Thumbs.db'
      ]
    });
    
    await archive.finalize();
    
    // Wait for file to be written
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });
    
    console.log(`☁️ Uploading to S3...`);
    
    // Upload to S3
    const fileStream = fs.createReadStream(zipPath);
    const key = `interviews/${interviewTakenId}/workspace-${timestamp}.zip`;
    
    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentType: 'application/zip',
      Metadata: {
        'interview-id': interviewTakenId,
        'created-at': new Date().toISOString(),
        'type': 'workspace-backup'
      }
    };
    
    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Cleanup temp file
    fs.unlinkSync(zipPath);
    
    console.log(`✅ Workspace saved successfully to S3: ${key}`);
    
    res.json({ 
      success: true, 
      key: key,
      bucket: bucket,
      timestamp: timestamp,
      interviewId: interviewTakenId,
      message: 'Workspace saved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error saving workspace:', error);
    res.status(500).json({ 
      error: 'Failed to save workspace',
      details: error.message 
    });
  }
});

// Get workspace save history
app.get('/api/workspace-history', async (req, res) => {
  const interviewTakenId = process.env.INTERVIEW_TAKEN_ID;
  const bucket = process.env.AWS_BUCKET;
  
  try {
    // This would require ListObjects permission to work fully
    // For now, just return a simple response
    res.json({
      interviewId: interviewTakenId,
      bucket: bucket,
      message: 'History endpoint - would list previous saves'
    });
  } catch (error) {
    console.error('❌ Error getting workspace history:', error);
    res.status(500).json({ 
      error: 'Failed to get workspace history',
      details: error.message 
    });
  }
});

// Trigger save from VS Code extension
app.post('/api/trigger-save', async (req, res) => {
  try {
    // This endpoint can be called by the VS Code extension
    // or any other service that wants to trigger a save
    const { reason = 'manual' } = req.body;
    
    console.log(`🔄 Save triggered: ${reason}`);
    
    // Call the save workspace function internally
    const saveResponse = await fetch('http://localhost:9000/api/save-workspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (saveResponse.ok) {
      const result = await saveResponse.json();
      res.json({
        success: true,
        reason: reason,
        result: result
      });
    } else {
      throw new Error('Save operation failed');
    }
    
  } catch (error) {
    console.error('❌ Error triggering save:', error);
    res.status(500).json({ 
      error: 'Failed to trigger save',
      details: error.message 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📂 Workspace directory: /home/ubuntu/interviewer-env`);
  console.log(`🆔 Interview ID: ${process.env.INTERVIEW_TAKEN_ID}`);
  console.log(`☁️ S3 Bucket: ${process.env.AWS_BUCKET}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 API Server shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 API Server shutting down...');
  process.exit(0);
});