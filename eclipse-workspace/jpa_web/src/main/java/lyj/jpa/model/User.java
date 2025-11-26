package lyj.jpa.model;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class User implements Serializable {
	@Id
	@Column(name = "user_id")
	private String userId;

	@Column(name = "user_name")
	private String userName;
}