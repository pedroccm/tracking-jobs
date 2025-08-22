import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id,
      title,
      company,
      location,
      description,
      url,
      external_id,
      status = 'applied',
      applied_date
    } = body;

    // Validate required fields
    if (!user_id || !title || !company) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, title, company' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if job already exists for this user (prevent duplicates)
    if (external_id) {
      const { data: existingJob } = await supabase
        .from('jobs')
        .select('id')
        .eq('user_id', user_id)
        .eq('external_id', external_id)
        .single();

      if (existingJob) {
        return NextResponse.json(
          { error: 'Job already exists for this user' },
          { status: 409 }
        );
      }
    }

    // Insert job into database
    const { data: job, error: insertError } = await supabase
      .from('jobs')
      .insert({
        user_id,
        title: title.substring(0, 255), // Ensure title fits in varchar
        company: company.substring(0, 255), // Ensure company fits in varchar
        location: location || null,
        description: description || null,
        url: url || null,
        external_id: external_id || null,
        status,
        applied_date: applied_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save job to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      job: job,
      message: 'Job captured successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}