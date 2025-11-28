import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET all books
export async function GET() {
  try {
    const promisePool = mysqlPool.promise();
    const [rows] = await promisePool.query(`
      SELECT b.*, u.name as created_by_name 
      FROM books b 
      LEFT JOIN users u ON b.created_by = u.id 
      ORDER BY b.created_at DESC
    `);
    
    console.log('Fetched books:', rows.length);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// CREATE new book
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, isbn, price, description, cover_image, stock_quantity, created_by } = body;

    console.log('Creating book:', { title, author, created_by });

    const promisePool = mysqlPool.promise();
    const [result] = await promisePool.query(
      `INSERT INTO books (title, author, isbn, price, description, cover_image, stock_quantity, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, price, description, cover_image, stock_quantity, created_by]
    );

    console.log('Book created with ID:', result.insertId);

    const [rows] = await promisePool.query(
      `SELECT b.*, u.name as created_by_name 
       FROM books b 
       LEFT JOIN users u ON b.created_by = u.id 
       WHERE b.id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });

  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}