import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET single book
export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    console.log('Fetching book with ID:', id);

    const promisePool = mysqlPool.promise();
    const [rows] = await promisePool.query(
      `SELECT b.*, u.name as created_by_name 
       FROM books b 
       LEFT JOIN users u ON b.created_by = u.id 
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// UPDATE book
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Add await here
    const body = await request.json();
    const { title, author, isbn, price, description, cover_image, stock_quantity } = body;

    console.log('Updating book ID:', id, 'with data:', body);

    const promisePool = mysqlPool.promise();
    
    // Check if book exists
    const [exists] = await promisePool.query(
      'SELECT id FROM books WHERE id = ?',
      [id]
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    await promisePool.query(
      `UPDATE books 
       SET title = ?, author = ?, isbn = ?, price = ?, description = ?, cover_image = ?, stock_quantity = ?
       WHERE id = ?`,
      [title, author, isbn, price, description, cover_image, stock_quantity, id]
    );

    console.log('Book updated successfully, ID:', id);

    const [rows] = await promisePool.query(
      `SELECT b.*, u.name as created_by_name 
       FROM books b 
       LEFT JOIN users u ON b.created_by = u.id 
       WHERE b.id = ?`,
      [id]
    );

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE book - COMPLETELY FIXED VERSION
export async function DELETE(request, { params }) {
  try {
    // Extract ID from params with await
    const { id } = await params;
    console.log('DELETE API: Attempting to delete book with ID:', id, 'Type:', typeof id);

    // Validate ID
    if (!id) {
      console.error('DELETE API: No ID provided');
      return NextResponse.json(
        { error: 'Invalid book ID: No ID provided' },
        { status: 400 }
      );
    }

    // Convert to number and validate
    const bookId = parseInt(id);
    if (isNaN(bookId) || bookId <= 0) {
      console.error('DELETE API: Invalid ID format:', id);
      return NextResponse.json(
        { error: `Invalid book ID: ${id}. Must be a positive number.` },
        { status: 400 }
      );
    }

    const promisePool = mysqlPool.promise();

    // Check if book exists
    console.log('DELETE API: Checking if book exists with ID:', bookId);
    const [exists] = await promisePool.query(
      'SELECT id, title FROM books WHERE id = ?',
      [bookId]
    );

    if (exists.length === 0) {
      console.error('DELETE API: Book not found with ID:', bookId);
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }

    console.log('DELETE API: Book found:', exists[0].title);

    // Delete the book
    console.log('DELETE API: Executing DELETE query for ID:', bookId);
    const [result] = await promisePool.query(
      'DELETE FROM books WHERE id = ?', 
      [bookId]
    );
    
    console.log('DELETE API: Delete result - Affected rows:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      console.error('DELETE API: No rows affected - book may not have been deleted');
      return NextResponse.json(
        { error: 'Book deletion failed - no rows affected' },
        { status: 500 }
      );
    }

    console.log('DELETE API: Book deleted successfully, ID:', bookId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Book deleted successfully',
      deletedId: bookId
    });

  } catch (error) {
    console.error('DELETE API: Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book: ' + error.message },
      { status: 500 }
    );
  }
}