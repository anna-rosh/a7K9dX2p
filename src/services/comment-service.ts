import { v4 as uuidv4 } from 'uuid';
import { getDb, type CommentCollection } from '../database/database';
import { RXDB_COLLECTION_NAME } from '../constants';
import type { Comment, CommentBase, CommentInput, User } from '../types';
import type { RxDocument } from 'rxdb';

class CommentService {
  private collection: CommentCollection | null = null;

  private async getCollection(): Promise<CommentCollection> {
    if (!this.collection) {
      const db = await getDb();
      this.collection = db[RXDB_COLLECTION_NAME];
    }
    return this.collection;
  }

  private createAuthorData(user: User): {
    authorId: string;
    authorName: string;
  } {
    return {
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
    };
  }

  private createCommentData(text: string, user: User): CommentBase {
    return {
      id: uuidv4(),
      text,
      ...this.createAuthorData(user),
      createdAt: new Date().toISOString(),
    };
  }

  toCommentObj(doc: RxDocument<Comment>): Comment {
    return {
      id: doc.id,
      text: doc.text,
      authorId: doc.authorId,
      authorName: doc.authorName,
      createdAt: doc.createdAt,
      replies: doc.replies,
    };
  }

  async createComment(input: CommentInput, user: User): Promise<Comment> {
    if (input.parentId) {
      return this.addReply(input.parentId, input.text, user);
    }

    const comment = {
      ...this.createCommentData(input.text, user),
      replies: [],
    };

    const collection = await this.getCollection();
    const commentDoc = await collection.insert(comment);

    return this.toCommentObj(commentDoc);
  }

  async addReply(parentId: string, text: string, user: User): Promise<Comment> {
    const reply = {
      ...this.createCommentData(text, user),
    };

    const collection = await this.getCollection();
    const parentDoc = await collection
      .findOne({ selector: { id: parentId } })
      .exec();

    if (!parentDoc) {
      throw new Error('Parent comment not found');
    }

    const updatedReplies = [...parentDoc.replies, reply];
    const updatedParentDoc = await parentDoc.update({
      $set: { replies: updatedReplies },
    });

    return this.toCommentObj(updatedParentDoc);
  }

  async getAllComments(): Promise<Comment[]> {
    const collection = await this.getCollection();
    const docs = await collection.find().sort({ createdAt: 'desc' }).exec();

    return docs.map((doc) => this.toCommentObj(doc));
  }

  async deleteComment(id: string): Promise<Comment> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ selector: { id } }).exec();

    if (!doc) {
      throw new Error('Component not found');
    }

    const deletedCommentDoc = await doc.remove();
    return this.toCommentObj(deletedCommentDoc);
  }

  async getCommentsObservable() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: 'desc' }).$;
  }
}

export const commentService = new CommentService();
