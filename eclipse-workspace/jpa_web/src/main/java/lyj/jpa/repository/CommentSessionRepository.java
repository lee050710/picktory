package lyj.jpa.repository;

import lyj.jpa.model.Comment;

import jakarta.persistence.*;
import java.util.List;
import java.util.Map;

public class CommentSessionRepository {
    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpa_javaPU");

    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public Comment selectCommentByPrimaryKey(Long commentNo) {
        EntityManager entityManager = getEntityManager();
        try {
            return entityManager.find(Comment.class, commentNo);
        } finally {
            entityManager.close();
        }
    }

    public List<Comment> selectCommentByCondition(Map<String, Object> condition) {
        EntityManager entityManager = getEntityManager();
        try {
            StringBuilder jpql = new StringBuilder("SELECT c FROM Comment c WHERE 1=1");
            
            // Null 체크를 추가하여 안전성 확보
            if (condition != null) {
                if (condition.containsKey("userId")) {
                    jpql.append(" AND c.userId = :userId");
                }
                if (condition.containsKey("commentContent")) {
                    jpql.append(" AND c.commentContent LIKE :commentContent");
                }
            }
            
            TypedQuery<Comment> query = entityManager.createQuery(jpql.toString(), Comment.class);
            
            // Null 체크를 추가하여 안전성 확보
            if (condition != null) {
                if (condition.containsKey("userId")) {
                    query.setParameter("userId", condition.get("userId"));
                }
                if (condition.containsKey("commentContent")) {
                    query.setParameter("commentContent", "%" + condition.get("commentContent") + "%");
                }
            }
            return query.getResultList();
        } finally {
            entityManager.close();
        }
    }

    public Integer insertComment(Comment comment) {
        EntityManager entityManager = getEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            entityManager.persist(comment);
            tx.commit();
            return 1;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }

    public Integer updateComment(Comment comment) {
        EntityManager entityManager = getEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            entityManager.merge(comment);
            tx.commit();
            return 1;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }

    public Integer deleteComment(Long commentNo) {
        EntityManager entityManager = getEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        int result = 0;
        try {
            tx.begin();
            Comment comment = entityManager.find(Comment.class, commentNo);
            if (comment != null) {
                entityManager.remove(comment);
                result = 1;
            }
            tx.commit();
            return result;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }
    
}